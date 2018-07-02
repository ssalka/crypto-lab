import React from 'react';
import { render } from 'react-dom';

import { CryptoLab } from './app';
import { StoreProvider } from './store';

render(
  <StoreProvider>
    <CryptoLab />
  </StoreProvider>,
  document.getElementById('root')
);
