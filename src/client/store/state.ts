import { initialState as appState, IAppState } from './app';

export interface IStoreState {
  app: IAppState;
}

export default {
  app: appState
};
