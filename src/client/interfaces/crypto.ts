export interface ICryptoAsset extends ICryptoAssetCustom, ICryptoCompareSchema {}

export interface ICryptoAssetCustom {
  name: ProjectName;
  ticker: CurrencyCode;
  type: string;
}

interface ICryptoCompareSchema extends Pick<ICryptoCompareCoin, 'IsTrading'> {}

export const enum ProjectName {
  USD = 'US Dollar',
  BTC = 'Bitcoin',
  ETH = 'Ethereum'
}

export const enum CurrencyCode {
  Dollar = 'USD',
  Bitcoin = 'BTC',
  Ethereum = 'ETH'
}

export interface ICryptoCompareResponse {
  Data: Record<string, ICryptoCompareCoin>;
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
