import { combineReducers } from 'redux';

import transfer from './transfers';
import compiler from './compiler';

const rootReducer = combineReducers({
  transfer,
  compiler,
});

export default rootReducer;
