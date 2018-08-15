import * as actions from './actions';

// tslint:disable-next-line
type CoinsActionCreators = typeof import('./actions');

export { actions, CoinsActionCreators };

export { default as initialState, ICoinsState } from './state';

export * from './types';
