export * from './Airtable';
export * from './CoinMarketCap';
export * from './crypto';
export * from './CryptoCompare';
export * from './view';

export type Omit<T extends {}, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
