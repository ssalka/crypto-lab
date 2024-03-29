import { CurrencyCode, ProjectName } from './crypto';

export interface ICryptoCompareSchema extends Pick<ICryptoCompareCoin, 'CoinName' | 'IsTrading'> {
  price?: number;
}

export interface ICryptoCompareResponse {
  Data: Record<string, ICryptoCompareCoin>;
}

export interface ICryptoCompareCoin {
  Algorithm: string;
  CoinName: ProjectName;
  FullName: string;
  FullyPremined: string;
  Id: string;
  ImageUrl: string;
  IsTrading: boolean;
  Name: string;
  PreMinedValue: string;
  ProofType: string;
  SortOrder: string;
  Sponsored: boolean;
  Symbol: CurrencyCode;
  TotalCoinSupply: string;
  TotalCoinsFreeFloat: string;
  Url: string;
  price?: number;
}

export interface INormalizedCryptoCompareCoin {
  name: ICryptoCompareCoin['CoinName'];
  logo: ICryptoCompareCoin['ImageUrl'];
  symbol: ICryptoCompareCoin['Symbol'];
  trading: ICryptoCompareCoin['IsTrading'];
  price?: ICryptoCompareCoin['price'];
}
