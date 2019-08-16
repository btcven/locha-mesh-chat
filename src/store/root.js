import { combineReducers } from "redux";
import { AplicationReducer } from "./aplication";
import { configurationReducer } from "./configuration";
import { contactsReducer } from "./contacts";
import { createNavigationReducer } from "react-navigation-redux-helpers";

import { AppStackNavigator } from "../routes";

const navReducer = createNavigationReducer(AppStackNavigator);

export const rootReducer = combineReducers({
  aplication: AplicationReducer,
  config: configurationReducer,
  contacts: contactsReducer
});
