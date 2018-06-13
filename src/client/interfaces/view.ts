export const enum ViewName {
  Coins = 'Coins'
}

export const enum ViewType {
  Table = 'table',
  BasicCoin = 'basic-coin'
}

export interface IView {
  name: ViewName;
  type: ViewType;
}
