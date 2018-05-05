export interface ICryptoAsset extends ICryptoAssetCustom, ICryptoCompareSchema {}

export interface ICryptoAssetCustom {
  name: CryptoAsset;
  ticker: string;
  type: string;
}

interface ICryptoCompareSchema extends Pick<ICryptoCompareCoin, 'IsTrading'> {}

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
