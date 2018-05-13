import CoinMarketCap from 'coinmarketcap-api';
import express from 'express';
import _ from 'lodash';

import { indexHtml } from '../config';
import { ICoinMarketCapResponse } from 'src/client/interfaces/CoinMarketCap';

const mapValuesToNumbers = obj => _.mapValues(obj, _.toNumber);

const cmc = new CoinMarketCap();


const router = express.Router();


router.get('/cmc', async (req, res) => {
  const { data }: ICoinMarketCapResponse = await cmc.getTicker();
  res.json(_.values(data));
});

router.get('/*', (req, res) => res.sendFile(indexHtml));

export default router;
