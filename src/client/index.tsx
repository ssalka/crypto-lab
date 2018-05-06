import React from 'react';
import { render } from 'react-dom';

import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { ICryptoAssetCustom, ICryptoCompareCoin, CurrencyCode, ProjectName } from './interfaces';

const cryptoCompare = new CryptoCompareAPI();

const coins: ICryptoAssetCustom[] = [{
  name: ProjectName.BTC,
  ticker: CurrencyCode.Bitcoin,
  type: 'Cryptocurrency'
}, {
  name: ProjectName.ETH,
  ticker: CurrencyCode.Ethereum,
  type: 'Smart Contract Platform'
}];

const loadCoins = async (assets: ProjectName[]) => {
  const ccCoinData: ICryptoCompareCoin[] = await cryptoCompare.getCoins(assets);
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ name }) => name === asset));

  return assets.map((asset, i) => ({ ...ownCoinData[i], ...ccCoinData[i] }));
};

render(
  <CryptoAssetTable
    assets={[ProjectName.BTC, ProjectName.ETH]}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
