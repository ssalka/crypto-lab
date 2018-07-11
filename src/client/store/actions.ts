import { IAppActions, loadCoins } from './app';

export const app: IAppActions = {
  loadCoins
};

// XXX: figure out how to specify this interface as the type of the module (declaration file?)
export interface IStoreActionsMap {
  app: IAppActions;
}
