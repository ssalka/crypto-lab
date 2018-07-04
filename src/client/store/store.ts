import { combineReducers, createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { loadCoinsEpic } from './app/epics';
import appReducer from './app/reducers';
import initialState, { IStoreState } from './state';

const rootEpic = combineEpics(loadCoinsEpic);
const epicMiddleware = createEpicMiddleware();

export default createStore(
  combineReducers({
    app: appReducer
  }),
  initialState as IStoreState,
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);
