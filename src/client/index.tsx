import React from 'react';
import { render } from 'react-dom';

import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { CryptoAsset, ICryptoAssetCustom, ICryptoCompareCoin } from './interfaces';

const cryptoCompare = new CryptoCompareAPI();

const coins: ICryptoAssetCustom[] = [{
  name: CryptoAsset.BTC,
  ticker: 'Bitcoin',
  type: 'Cryptocurrency'
}, {
  name: CryptoAsset.ETH,
  ticker: 'Ethereum',
  type: 'Smart Contract Platform'
}];

const loadCoins = async (assets: CryptoAsset[]) => {
  const ccCoinData: ICryptoCompareCoin[] = await cryptoCompare.getCoins(assets);
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ ticker }) => ticker === asset));

  return assets.map((asset, i) => ({ ...ownCoinData[i], ...ccCoinData[i] }));
};

render(
  <CryptoAssetTable
    assets={[CryptoAsset.BTC, CryptoAsset.ETH]}
    loader={loadCoins}
  />,
  document.getElementById('root')
);
