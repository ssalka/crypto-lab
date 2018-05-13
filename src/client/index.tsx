import React from 'react';
import { render } from 'react-dom';

import AirtableAPI from './api/AirtableAPI';
import CoinMarketCapAPI from './api/CoinMarketCapAPI';
import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { IAirtableCoin, ICoinMarketCapCoin, ICryptoAsset, ICryptoCompareSchema, ProjectName } from './interfaces';

const coinsToLoad: ProjectName[] = [
  ProjectName.BTC,
  ProjectName.ETH,
  ProjectName.LTC
];

function mergeLists(
  ownData: IAirtableCoin[],
  cmcData: ICoinMarketCapCoin[],
  ccData: ICryptoCompareSchema[]
): ICryptoAsset[] {

  return ownData
    .map((coin, i) => ({
      ownCoin: coin,
      cmcCoin: cmcData[i],
      ccCoin: ccData[i]
    }))
    .map(({ ownCoin, cmcCoin, ccCoin }): ICryptoAsset => ({
      ...ownCoin,
      IsTrading: ccCoin.IsTrading,
      price: ccCoin.price || cmcCoin.quotes.USD.price,
      marketCap: cmcCoin.quotes.USD.market_cap
    }));
}

const loadCoins = async (assets: ProjectName[]) => {
  const airtable = new AirtableAPI();
  airtable.setCoinList(assets);

  const cryptoCompare = new CryptoCompareAPI();
  cryptoCompare.setCoinList(assets);

  const coinMarketCap = new CoinMarketCapAPI();
  coinMarketCap.setCoinList(assets);

  const ownCoinData: IAirtableCoin[] = await airtable.getCoins();
  const cmcCoinData: ICoinMarketCapCoin[] = await coinMarketCap.getCoins();
  const ccCoinData: ICryptoCompareSchema[] = await cryptoCompare.getCoins();

  return mergeLists(ownCoinData, cmcCoinData, ccCoinData);
};

render(
  <CryptoAssetTable
    assets={coinsToLoad}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
