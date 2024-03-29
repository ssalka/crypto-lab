import _ from 'lodash/fp';

import { ICryptoAsset } from 'src/client/interfaces';
import { success } from 'src/client/store/utils';
import { IFetchCoinsResponse } from './api';
import initialState, { ICoinsState } from './state';
import { CoinsAction } from './types';

function getCoinFromProviders({ airtable, coinMarketCap, cryptoCompare }: IFetchCoinsResponse): ICryptoAsset {
  // NOTE: need a way for the user to configure field overrides here
  const defaults = {
    price: 0,
    marketCap: 0
  };

  const customFields = {
    trading: cryptoCompare && cryptoCompare.trading
      || coinMarketCap && !!coinMarketCap.price
      || !_.isEmpty(airtable.listedOn)
  };

  return {
    ...defaults,
    ...cryptoCompare,
    ...coinMarketCap,
    ...airtable,
    ...customFields
  };
}

export default (state = initialState, { type, payload }): ICoinsState => {
  switch (type) {
    case success(CoinsAction.LoadAll):
      return {
        all: payload.map(getCoinFromProviders),
        loading: false
      };
    default:
      return state;
  }
};
