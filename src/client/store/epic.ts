import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { loadCoinsEpic } from './app/epics';

export default combineEpics(loadCoinsEpic);

export const epicMiddleware = createEpicMiddleware();
