import _ from 'lodash/fp';
import React from 'react';
import { render } from 'react-dom';

import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { ICryptoAsset, ICryptoAssetCustom, ICryptoCompareCoin, CurrencyCode, ProjectName } from './interfaces';

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

const mergeLists = _.zipWith<ICryptoAssetCustom, ICryptoCompareCoin, ICryptoAsset>(_.assign);

const loadCoins = async (assets: ProjectName[]) => {
  const cryptoCompare = new CryptoCompareAPI();
  cryptoCompare.setCoinList(assets);

  const ccCoinData: ICryptoCompareCoin[] = await cryptoCompare.getCoins();
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ name }) => name === asset));

  return mergeLists(ownCoinData, ccCoinData);
};

render(
  <CryptoAssetTable
    assets={coinsToLoad}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
