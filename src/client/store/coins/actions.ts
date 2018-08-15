import { ActionCreator } from 'redux';
import { CoinsAction, ICoinsAction } from './types';

export const loadAllCoins: ActionCreator<ICoinsAction> = () => ({
  type: CoinsAction.LoadAll
});
