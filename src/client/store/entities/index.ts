import * as actions from './actions';

// tslint:disable-next-line
type EntityActionCreators = typeof import('./actions');

export { actions, EntityActionCreators };

export { default as initialState, IEntityState } from './state';
