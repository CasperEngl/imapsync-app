import { combineReducers } from 'redux';

import transfer from './transfer';
import compiler from './compiler';

const rootReducer = combineReducers<any>({
	transfer,
	compiler,
});

export default rootReducer;
