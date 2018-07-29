import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { loadCoinsEpic } from './app/epics';
import { loadAllEpic } from './entities/epics';

export const epicMiddleware = createEpicMiddleware();

export default combineEpics(loadAllEpic, loadCoinsEpic);
