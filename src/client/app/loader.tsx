import _ from 'lodash/fp';

import AirtableAdapter from 'src/client/adapters/AirtableAdapter';
import CoinMarketCapAdapter from 'src/client/adapters/CoinMarketCapAdapter';
import CryptoCompareAdapter from 'src/client/adapters/CryptoCompareAdapter';
import {
  IAirtableCoin,
  ICoinMarketCapMetadata,
  ICryptoCompareCoin
} from 'src/client/interfaces';

interface ILoaderResponse {
  airtable: IAirtableCoin;
  coinMarketCap: ICoinMarketCapMetadata;
  cryptoCompare: ICryptoCompareCoin;
}

type Loader = () => Promise<ILoaderResponse[]>;

const loader: Loader = async () => {
  const airtable = new AirtableAdapter();

  if (!await airtable.getCoins()) return [];

  // TODO: add in other types
  const airtableCoinData = airtable.allCoins.filter(c => c.Symbol);

  const cryptoCompare = new CryptoCompareAdapter();
  cryptoCompare.setCoinList(_.map('Name', airtableCoinData));

  const coinMarketCap = new CoinMarketCapAdapter();
  coinMarketCap.setCoinList(_.map('Symbol', airtableCoinData));

  await Promise.all([
    coinMarketCap.getCoins(),
    cryptoCompare.getCoins()
  ]);

  return airtableCoinData.map((coin, i) => ({
    airtable: coin,
    coinMarketCap: coinMarketCap.coins[i],
    cryptoCompare: cryptoCompare.allCoins[coin.Symbol]
  }));
};

export default loader;

export {
  ILoaderResponse,
  Loader
};
