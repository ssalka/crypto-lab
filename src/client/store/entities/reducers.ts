import { success } from 'src/client/store/utils';
import initialState, { IEntityState } from './state';
import { EntityAction } from './types';

export default (state = initialState, { type, payload }): IEntityState => {
  switch (type) {
    case success(EntityAction.LoadAll):
      return {
        all: payload,
        loading: false
      };
    default:
      return state;
  }
};
