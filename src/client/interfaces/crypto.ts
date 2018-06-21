import { INormalizedAirtableCoin } from './Airtable';
import { INormalizedCoinMarketCapCoin } from './CoinMarketCap';
import { INormalizedCryptoCompareCoin } from './CryptoCompare';

export interface ICryptoAsset extends INormalizedAirtableCoin, INormalizedCoinMarketCapCoin, INormalizedCryptoCompareCoin {
  name: ProjectName;
  price: number;
  logo: string;
}

export type FieldName = keyof ICryptoAsset;

export const enum ProjectName {
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
