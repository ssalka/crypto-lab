export const enum CryptoLabAction {
  LoadCoins = 'LOAD_COINS'
}

export interface ICryptoLabAction {
  type: CryptoLabAction;
}
