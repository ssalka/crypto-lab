import _ from 'lodash/fp';
import React from 'react';
import { render } from 'react-dom';

import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { ICryptoAssetCustom, ICryptoCompareCoin, CurrencyCode, ProjectName } from './interfaces';

const coins: ICryptoAssetCustom[] = [{
  name: ProjectName.BTC,
  ticker: CurrencyCode.Bitcoin,
  type: 'Cryptocurrency'
}, {
  name: ProjectName.ETH,
  ticker: CurrencyCode.Ethereum,
  type: 'Smart Contract Platform'
}];

const coinsToLoad: ProjectName[] = _.map('name')(coins);

const loadCoins = async (assets: ProjectName[]) => {
  const cryptoCompare = new CryptoCompareAPI();
  cryptoCompare.setCoinList(assets);

  const ccCoinData: ICryptoCompareCoin[] = await cryptoCompare.getCoins();
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ name }) => name === asset));

  const mergeLists = _.zipWith((ownData, ccData) => ({ ...ownData, ...ccData }));

  return mergeLists(ownCoinData, ccCoinData);
};

render(
  <CryptoAssetTable
    assets={coinsToLoad}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
