import { CurrencyCode, ProjectName } from './crypto';

export interface ICryptoCompareSchema extends Pick<ICryptoCompareCoin, 'CoinName' | 'IsTrading'> {
  price?: number;
}

export interface ICryptoCompareResponse {
  Data: Record<string, ICryptoCompareCoin>;
}

export interface ICryptoCompareMetadata {
  price: number;
}

export interface ICryptoCompareCoin {
  Algorithm: string;
  CoinName: Exclude<ProjectName, ProjectName.USD>;
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
}

export type CryptoCompareCoin = ICryptoCompareCoin & Partial<ICryptoCompareMetadata>;
