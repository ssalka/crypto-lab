import { combineReducers } from 'redux';

import coinsReducer from './coins/reducers';
import entitiesReducer from './entities/reducers';

export default combineReducers({
  coins: coinsReducer,
  entities: entitiesReducer
});
