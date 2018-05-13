import { CurrencyCode, ProjectName } from './crypto';

export interface ICoinMarketCapCoin {
  '24h_volume_usd': number;
  available_supply: number;
  id: string;
  last_updated: number;
  market_cap_usd: number;
  max_supply: number;
  name: ProjectName;
  percent_change_1h: number;
  percent_change_7d: number;
  percent_change_24h: number;
  price_btc: number;
  price_usd: number;
  rank: number;
  symbol: CurrencyCode;
  total_supply: number;
}

export interface ICoinMarketCapResponse {
  Data: Record<string, ICoinMarketCapCoin>;
}
