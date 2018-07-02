import _ from 'lodash/fp';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import AirtableAdapter from 'src/client/adapters/AirtableAdapter';
import CoinMarketCapAdapter from 'src/client/adapters/CoinMarketCapAdapter';
import CryptoCompareAdapter from 'src/client/adapters/CryptoCompareAdapter';
import { INormalizedAirtableCoin, INormalizedCoinMarketCapCoin, INormalizedCryptoCompareCoin } from 'src/client/interfaces';
import { toSuccessAction } from 'src/client/store/utils';
import { AppAction } from './types';

export interface ILoaderResponse {
  airtable: INormalizedAirtableCoin;
  coinMarketCap?: INormalizedCoinMarketCapCoin;
  cryptoCompare?: INormalizedCryptoCompareCoin;
}

export type Loader = () => Promise<ILoaderResponse[]>;

const loader: Loader = async () => {
  const airtable = new AirtableAdapter();

  if (!await airtable.getCoins()) return [];

  const cryptoCompare = new CryptoCompareAdapter();
  cryptoCompare.setCoinList(_.map('name', airtable.coins));

  const coinMarketCap = new CoinMarketCapAdapter();
  coinMarketCap.setCoinList(_.map('symbol', airtable.coins));

  await Promise.all([
    coinMarketCap.getCoins(),
    cryptoCompare.getCoins()
  ]);

  return airtable.coins.map((coin, i) => ({
    airtable: coin,
    coinMarketCap: coinMarketCap.coins[i],
    cryptoCompare: cryptoCompare.coins[i]
  }));
};

export const loadCoinsEpic = action$ => action$.pipe(
  ofType(AppAction.LoadCoins),
  switchMap(
    action => from(loader()).pipe(
      map(toSuccessAction(AppAction.LoadCoins))
    )
  )
);
