import React, { SFC } from 'react';

import CryptoLab from './CryptoLab';
import StoreProvider from './StoreProvider';
import Theme from './Theme';

const App: SFC = () => (
  <StoreProvider>
    <Theme type="light">
      <CryptoLab />
    </Theme>
  </StoreProvider>
);

export default App;
