import Airtable from 'airtable';
import { RequestHandler } from 'express';
import _ from 'lodash/fp';

import { IAirtableCoin } from 'src/client/interfaces/Airtable';

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_CYRPTO_TABLE_ID)
  .table('Coins');

const mapToFields = _.map('fields');

export const getCoins: RequestHandler = async (req, res) => {
  const results: IAirtableCoin[] = [];

  function addPage(page) {
    results.push(...mapToFields(page));
  }

  airtable
    .select({
      sort: [{
        field: 'Rank',
        direction: 'asc'
      }],
      view: 'Main'
    })
    .eachPage(
      (records, next) => (addPage(records), next()),
      error => error
        ? res.status(500).send(error)
        : res.json(results)
    );
};
