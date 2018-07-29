import { combineReducers } from 'redux';

import appReducer from './app/reducers';
import entitiesReducer from './entities/reducers';

export default combineReducers({
  app: appReducer,
  entities: entitiesReducer
});
