import React, { Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Coins from './Coins';

export default () => (
  <BrowserRouter>
    <Fragment>
      <Route exact={true} path="/" render={Coins.toExactPath} />
      <Route path="/coins" component={Coins} />
    </Fragment>
  </BrowserRouter>
);
