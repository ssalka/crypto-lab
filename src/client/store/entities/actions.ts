import { ActionCreator } from 'redux';

import { EntityAction, IEntityAction } from './types';

export const loadAllEntities: ActionCreator<IEntityAction> = () => ({
  type: EntityAction.LoadAll
});
