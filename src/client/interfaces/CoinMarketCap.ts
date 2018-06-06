import { CurrencyCode, ProjectName } from './crypto';

export interface ICoinMarketCapCoin {
  id: number;
  name: ProjectName;
  symbol: CurrencyCode;
  website_slug: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      market_cap: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
    }
  };
  last_updated: number;
}

export interface ICoinMarketCapMetadata {
  marketCap: number;
  price: number;
}

export interface ICoinMarketCapResponse {
  data: Record<string, ICoinMarketCapCoin>;
}

export type CoinMarketCapCoin = ICoinMarketCapMetadata;
