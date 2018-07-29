import { ActionCreator } from 'redux';

import { EntityAction, IEntityAction } from './types';

export const loadAll: ActionCreator<IEntityAction> = () => ({
  type: EntityAction.LoadAll
});
