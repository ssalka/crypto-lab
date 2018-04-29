import React from 'react';
import { render } from 'react-dom';
import CryptoAssetTable, { CryptoAsset } from './components/CryptoAssetTable';

render(
  <CryptoAssetTable assets={[CryptoAsset.BTC, CryptoAsset.ETH]} />,
  document.getElementById('root')
);
