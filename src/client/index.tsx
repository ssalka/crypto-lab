import _ from 'lodash/fp';
import React from 'react';
import { render } from 'react-dom';

import AirtableAPI from './api/AirtableAPI';
import CoinMarketCapAPI from './api/CoinMarketCapAPI';
import CryptoCompareAPI from './api/CryptoCompareAPI';
import CryptoLab, { Loader } from './CryptoLab';

const loader: Loader = async () => {
  const airtable = new AirtableAPI();

  if (!await airtable.getCoins()) return [];

  // TODO: add in other types
  const airtableCoinData = airtable.allCoins.filter(c => c.Symbol);

  const cryptoCompare = new CryptoCompareAPI();
  cryptoCompare.setCoinList(_.map('Name', airtableCoinData));

  const coinMarketCap = new CoinMarketCapAPI();
  coinMarketCap.setCoinList(_.map('Symbol', airtableCoinData));

  await Promise.all([
    coinMarketCap.getCoins(),
    cryptoCompare.getCoins()
  ]);

  return airtableCoinData.map((coin, i) => ({
    airtable: coin,
    coinMarketCap: coinMarketCap.coins[i],
    cryptoCompare: cryptoCompare.allCoins[coin.Symbol]
  }));
};

render(
  <CryptoLab loader={loader} />,
  document.getElementById('root')
);
