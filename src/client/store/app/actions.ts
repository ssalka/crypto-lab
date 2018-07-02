import { ActionCreator } from 'redux';
import { CryptoLabAction, ICryptoLabAction } from './types';

export const loadCoins: ActionCreator<ICryptoLabAction> = () => ({
  type: CryptoLabAction.LoadCoins
});
