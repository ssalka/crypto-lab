import React from 'react';
import { render } from 'react-dom';
import { CryptoAssetTable } from './components';
import { CryptoAsset } from './interfaces';

render(
  <CryptoAssetTable assets={[CryptoAsset.BTC, CryptoAsset.ETH]} />,
  document.getElementById('root')
);
