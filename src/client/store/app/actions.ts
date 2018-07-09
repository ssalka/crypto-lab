import { ActionCreator } from 'redux';
import { AppAction, IAppAction } from './types';

export const loadCoins: ActionCreator<IAppAction> = () => ({
  type: AppAction.LoadCoins
});

export interface IAppActions {
  loadCoins: typeof loadCoins;
}
