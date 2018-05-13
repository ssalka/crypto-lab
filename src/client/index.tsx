import _ from 'lodash/fp';
import React from 'react';
import { render } from 'react-dom';

import CoinMarketCapAPI from './api/CoinMarketCapAPI';
import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { ICoinMarketCapCoin, ICryptoAsset, ICryptoAssetCustom, ICryptoCompareSchema, CurrencyCode, ProjectName } from './interfaces';

const coins: ICryptoAssetCustom[] = [{
  name: ProjectName.BTC,
  ticker: CurrencyCode.Bitcoin,
  type: 'Cryptocurrency'
}, {
  name: ProjectName.ETH,
  ticker: CurrencyCode.Ethereum,
  type: 'Smart Contract Platform'
}, {
  name: ProjectName.LTC,
  ticker: CurrencyCode.Litecoin,
  type: 'Cryptocurrency'
}];

const coinsToLoad: ProjectName[] = _.map('name')(coins);

function mergeLists(
  ownData: ICryptoAssetCustom[],
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
      price: ccCoin.price || cmcCoin.price_usd,
      marketCap: cmcCoin.market_cap_usd
    }));
}

const loadCoins = async (assets: ProjectName[]) => {
  const cryptoCompare = new CryptoCompareAPI();
  cryptoCompare.setCoinList(assets);

  const coinMarketCap = new CoinMarketCapAPI();
  coinMarketCap.setCoinList(assets);

  const ccCoinData: ICryptoCompareSchema[] = await cryptoCompare.getCoins();
  const cmcCoinData: ICoinMarketCapCoin[] = await coinMarketCap.getCoins();
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ name }) => name === asset));

  return mergeLists(ownCoinData, cmcCoinData, ccCoinData);
};

render(
  <CryptoAssetTable
    assets={coinsToLoad}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
