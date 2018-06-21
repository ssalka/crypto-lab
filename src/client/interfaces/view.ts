export const enum ViewName {
  Coins = 'Coins'
}

export const enum ViewType {
  Table = 'table',
  Project = 'project'
}

export interface IView {
  name: ViewName;
  type: ViewType;
  config?: {
    [key: string]: any;
  };
}
