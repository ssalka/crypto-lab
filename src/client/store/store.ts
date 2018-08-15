import { createStore, applyMiddleware } from 'redux';

import rootEpic, { epicMiddleware } from './epic';
import rootReducer from './reducer';
import * as initialState from './state';

export default createStore(
  rootReducer,
  initialState,
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);
