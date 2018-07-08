import React, { SFC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import CryptoLab from './CryptoLab';
import StoreProvider from './StoreProvider';
import Theme from './Theme';

const App: SFC = () => (
  <StoreProvider>
    <Theme type="light">
      <BrowserRouter>
        <CryptoLab />
      </BrowserRouter>
    </Theme>
  </StoreProvider>
);

export default App;
