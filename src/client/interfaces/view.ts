export const enum ViewName {
  Coins = 'Coins'
}

export const enum ViewType {
  Table = 'table'
}

export interface IView {
  name: ViewName;
  type: ViewType;
}
