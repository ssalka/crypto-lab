import React from 'react';
import { render } from 'react-dom';

import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { ICryptoAssetCustom, ICryptoCompareCoin, ProjectName } from './interfaces';

const cryptoCompare = new CryptoCompareAPI();

const coins: ICryptoAssetCustom[] = [{
  name: ProjectName.BTC,
  ticker: 'Bitcoin',
  type: 'Cryptocurrency'
}, {
  name: ProjectName.ETH,
  ticker: 'Ethereum',
  type: 'Smart Contract Platform'
}];

const loadCoins = async (assets: ProjectName[]) => {
  const ccCoinData: ICryptoCompareCoin[] = await cryptoCompare.getCoins(assets);
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ ticker }) => ticker === asset));

  return assets.map((asset, i) => ({ ...ownCoinData[i], ...ccCoinData[i] }));
};

render(
  <CryptoAssetTable
    assets={[ProjectName.BTC, ProjectName.ETH]}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
