import Airtable from 'airtable';
import CoinMarketCap from 'coinmarketcap-api';
import express from 'express';
import _ from 'lodash';

import { indexHtml } from '../config';
import { IAirtableCoin } from 'src/client/interfaces/Airtable';
import { ICoinMarketCapResponse } from 'src/client/interfaces/CoinMarketCap';

const mapValuesToNumbers = obj => _.mapValues(obj, _.toNumber);

const cmc = new CoinMarketCap();

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('appCZucSvR6DBmCpV')
  .table('Crypto Actors');

const router = express.Router();

router.get('/airtable', async (req, res) => {
  const results: IAirtableCoin[] = [];

  airtable
    .select({
      sort: [{
        field: 'Rank',
        direction: 'asc'
      }],
      view: 'Main Coins'
    })
    .eachPage((records, next) => {
      results.push(..._.map(records, 'fields'));
      next();
    }, error => {
      if (error) res.status(500).send(error);
      else res.json(results);
    });
});

router.get('/cmc', async (req, res) => {
  const { data }: ICoinMarketCapResponse = await cmc.getTicker();
  res.json(_.values(data));
});

router.get('/*', (req, res) => res.sendFile(indexHtml));

export default router;
