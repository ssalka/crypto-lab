import CoinMarketCap from 'coinmarketcap-api';
import express from 'express';
import _ from 'lodash';

import { IAirtableCoin } from 'src/client/interfaces/Airtable';
import { ICoinMarketCapResponse } from 'src/client/interfaces/CoinMarketCap';
import { indexHtml } from '../config';
import { getCoins } from './airtable';

const cmc = new CoinMarketCap();

const router = express.Router();

router.get('/airtable', getCoins);

router.get('/cmc', async (req, res) => {
  const { data }: ICoinMarketCapResponse = await cmc.getTicker();
  res.json(_.values(data));
});

router.get('/*', (req, res) => res.sendFile(indexHtml));

export default router;
