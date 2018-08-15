import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { loadAllEpic as loadCoins } from './coins/epics';
import { loadAllEpic as loadEntities } from './entities/epics';

export const epicMiddleware = createEpicMiddleware();

export default combineEpics(loadCoins, loadEntities);
