/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import { AplicationReducer } from './aplication';
import { configurationReducer } from './configuration';
import { contactsReducer } from './contacts';
import { deviceInfoReducer } from './deviceSettins';
import { chatReducer } from './chats';

export const rootReducer = combineReducers({
  aplication: AplicationReducer,
  config: configurationReducer,
  contacts: contactsReducer,
  chats: chatReducer,
  device: deviceInfoReducer
});
