import Airtable from 'airtable';
import { RequestHandler } from 'express';
import _ from 'lodash/fp';

import { IAirtableCoin, IAirtableEntity } from 'src/client/interfaces/Airtable';

const { AIRTABLE_API_KEY, AIRTABLE_CYRPTO_TABLE_ID } = process.env;

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_CYRPTO_TABLE_ID);

const mapToFields = _.map('fields');

interface IAirtableSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

interface IQueryParams {
  sort?: IAirtableSortParams[];
}

function createRequestHandler<T>(tableName: string, params?: IQueryParams): RequestHandler {
  return (req, res) => {
    const results: T[] = [];

    function addPage(page) {
      results.push(...mapToFields(page));
    }

    airtable
      .table(tableName)
      .select({
        ...params,
        view: 'Main'
      })
      .eachPage(
        (records, next) => (addPage(records), next()),
        error => error
          ? res.status(500).send(error)
          : res.json(results)
      );
  };
}

export const getEntities = createRequestHandler<IAirtableEntity[]>('Entities');

export const getCoins = createRequestHandler<IAirtableCoin[]>('Coins', {
  sort: [{
    field: 'Rank',
    direction: 'asc'
  }]
});
