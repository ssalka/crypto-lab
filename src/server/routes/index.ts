import CoinMarketCap from 'coinmarketcap-api';
import express from 'express';
import _ from 'lodash';

import { indexHtml } from '../config';

const mapValuesToNumbers = obj => _.mapValues(obj, _.toNumber);

const cmc = new CoinMarketCap();

const router = express.Router();

router.get('/cmc', async (req, res) => {
  const data = await cmc.getTicker();

  const coins = data.map(({ id, name, symbol, ...coin }) => ({
    id, name, symbol,
    ...mapValuesToNumbers(coin)
  }));

  res.json(coins);
});

router.get('/*', (req, res) => res.sendFile(indexHtml));

export default router;
