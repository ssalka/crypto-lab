import _ from 'lodash/fp';
import React from 'react';
import { render } from 'react-dom';

import AirtableAdapter from './adapters/AirtableAdapter';
import CoinMarketCapAdapter from './adapters/CoinMarketCapAdapter';
import CryptoCompareAdapter from './adapters/CryptoCompareAdapter';
import CryptoLab, { Loader } from './CryptoLab';

const loader: Loader = async () => {
  const airtable = new AirtableAdapter();

  if (!await airtable.getCoins()) return [];

  // TODO: add in other types
  const airtableCoinData = airtable.allCoins.filter(c => c.Symbol);

  const cryptoCompare = new CryptoCompareAdapter();
  cryptoCompare.setCoinList(_.map('Name', airtableCoinData));

  const coinMarketCap = new CoinMarketCapAdapter();
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
