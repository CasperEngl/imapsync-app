import { combineReducers } from 'redux';

import transfer from './transfer';
import compiler from './compiler';
import settings from './settings';

const rootReducer = combineReducers<any>({
	transfer,
	compiler,
	settings,
});

export default rootReducer;
