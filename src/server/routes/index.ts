import CoinMarketCap from 'coinmarketcap-api';
import { Router } from 'express';
import _ from 'lodash/fp';

import { IAirtableCoin } from 'src/client/interfaces/Airtable';
import { ICoinMarketCapCoin, ICoinMarketCapResponse } from 'src/client/interfaces/CoinMarketCap';
import { indexHtml } from '../config';
import { getCoins } from './airtable';

const cmc = new CoinMarketCap();

const router = Router();

const flatMapToValues = _.flatMap(({ data }) => _.values(data));

router.get('/airtable', getCoins);

router.get('/cmc', async (req, res) => {
  const responses: ICoinMarketCapResponse[] = await Promise.all(
    _.times(_.multiply(100), 15).map(start => cmc.getTicker({ start }))
  );

  const cmcCoins: ICoinMarketCapCoin[] = flatMapToValues(responses);

  res.json(cmcCoins);
});

router.get('/*', (req, res) => res.sendFile(indexHtml));

export default router;
