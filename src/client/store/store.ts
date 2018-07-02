import { combineReducers, createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { loadCoinsEpic } from './app/epics';
import appReducer from './app/reducers';

const rootEpic = combineEpics(loadCoinsEpic);
const epicMiddleware = createEpicMiddleware();

export default createStore(
  combineReducers({
    app: appReducer
  }),
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);
