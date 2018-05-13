import { ICoinMarketCapSchema } from './CoinMarketCap';
import { ICryptoCompareSchema } from './CryptoCompare';

export interface ICryptoAsset extends ICryptoAssetCustom, Pick<ICryptoCompareSchema, 'IsTrading'>, ICoinMarketCapSchema {}

export interface ICryptoAssetCustom {
  name: ProjectName;
  ticker?: CurrencyCode;
  type?: string;
}

export const enum ProjectName {
  USD = 'US Dollar',
  BTC = 'Bitcoin',
  ETH = 'Ethereum',
  LTC = 'Litecoin'
}

export const enum CurrencyCode {
  Dollar = 'USD',
  Bitcoin = 'BTC',
  Ethereum = 'ETH',
  Litecoin = 'LTC'
}
