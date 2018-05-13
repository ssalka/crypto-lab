import _ from 'lodash/fp';
import React from 'react';
import { render } from 'react-dom';

import AirtableAPI from './api/AirtableAPI';
import CoinMarketCapAPI from './api/CoinMarketCapAPI';
import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { ICoinMarketCapCoin, ICryptoAsset, ProjectName } from './interfaces';

const loadCoins = async () => {
  const airtable = new AirtableAPI();
  await airtable.getCoins();

  const ownCoinData = airtable.allCoins;
  const coinsToLoad: ProjectName[] = _.map('Name', ownCoinData);

  const cryptoCompare = new CryptoCompareAPI();
  cryptoCompare.setCoinList(coinsToLoad);

  const coinMarketCap = new CoinMarketCapAPI();
  coinMarketCap.setCoinList(coinsToLoad);

  const cmcCoinData: ICoinMarketCapCoin[] = await coinMarketCap.getCoins();
  await cryptoCompare.getCoins();

  return ownCoinData
    .map((coin, i) => ({
      ownCoin: coin,
      cmcCoin: coinMarketCap.allCoins[i] ? cmcCoinData[i] : null,
      ccCoin: cryptoCompare.allCoins[coin.Symbol]
    }))
    .map(({ ownCoin, cmcCoin, ccCoin }): ICryptoAsset => ({
      ...ownCoin,
      IsTrading: _.has('IsTrading', ccCoin) ? ccCoin.IsTrading : false,
      price: _.get('quotes.USD.price', cmcCoin) || 0,
      marketCap: _.get('quotes.USD.market_cap', cmcCoin) || ''
    }));
};

render(
  <CryptoAssetTable loader={loadCoins} />,
  document.getElementById('root')
);
