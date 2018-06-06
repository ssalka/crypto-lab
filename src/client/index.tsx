import React from 'react';
import { render } from 'react-dom';

import { CryptoLab, loader } from './app';

render(
  <CryptoLab loader={loader} />,
  document.getElementById('root')
);
