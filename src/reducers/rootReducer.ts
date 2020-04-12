import { combineReducers } from 'redux'

import transfer from './transfer'
import compiler from './compiler'
import settings from './settings'
import process from './process'

const rootReducer = combineReducers<any>({
  transfer,
  compiler,
  settings,
  process,
})

export default rootReducer
