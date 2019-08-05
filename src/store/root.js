import { combineReducers } from 'redux';
import {AplicationReducer} from './aplication'

export const rootReducer = combineReducers({
  aplication: AplicationReducer,
})