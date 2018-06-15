import { IAirtableCoin } from './Airtable';
import { CoinMarketCapCoin } from './CoinMarketCap';
import { ICryptoCompareCoin } from './CryptoCompare';

export interface ICryptoAsset extends IAirtableCoin, CoinMarketCapCoin {
  trading: ICryptoCompareCoin['IsTrading'];
}

export type FieldName = keyof ICryptoAsset;

export const enum ProjectName {
  USD = 'US Dollar',
  BTC = 'Bitcoin',
  ETH = 'Ethereum',
  LTC = 'Litecoin',
  IOTA = 'IOTA'
}

export const enum CurrencyCode {
  Dollar = 'USD',
  Bitcoin = 'BTC',
  Ethereum = 'ETH',
  Litecoin = 'LTC',
  IOTA = 'IOTA'
}
