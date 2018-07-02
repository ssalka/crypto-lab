import _ from 'lodash/fp';

import { ICryptoAsset } from 'src/client/interfaces';
import { success } from 'src/client/store/utils';
import { ILoaderResponse } from './epics';
import initialState from './state';
import { CryptoLabAction } from './types';

function getCoinFromProviders({ airtable, coinMarketCap, cryptoCompare }: ILoaderResponse): ICryptoAsset {
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

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case success(CryptoLabAction.LoadCoins):
      return {
        coins: payload.map(getCoinFromProviders)
      };
    default:
      return state;
  }
};
