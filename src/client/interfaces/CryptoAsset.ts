export interface ICryptoAsset {
  name: CryptoAsset;
  ticker: string;
  type: string;
  IsTrading?: boolean;
}

export enum CryptoAsset {
  BTC = 'Bitcoin',
  ETH = 'Ethereum'
}

export interface ICryptoCompareResponse {
  Data: Record<string, ICryptoCompareCoin>;
}

export interface ICryptoCompareCoin {
  Algorithm: string;
  CoinName: string;
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
  Symbol: string;
  TotalCoinSupply: string;
  TotalCoinsFreeFloat: string;
  Url: string;
}
