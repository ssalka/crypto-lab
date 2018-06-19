import _ from 'lodash/fp';

import AirtableAdapter from 'src/client/adapters/AirtableAdapter';
import CoinMarketCapAdapter from 'src/client/adapters/CoinMarketCapAdapter';
import CryptoCompareAdapter from 'src/client/adapters/CryptoCompareAdapter';
import {
  INormalizedAirtableCoin,
  INormalizedCoinMarketCapCoin,
  INormalizedCryptoCompareCoin
} from 'src/client/interfaces';

interface ILoaderResponse {
  airtable: INormalizedAirtableCoin;
  coinMarketCap: INormalizedCoinMarketCapCoin;
  cryptoCompare: INormalizedCryptoCompareCoin;
}

type Loader = () => Promise<ILoaderResponse[]>;

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

export default loader;

export {
  ILoaderResponse,
  Loader
};
