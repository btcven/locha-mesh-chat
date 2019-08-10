import { ActionTypes } from "../constants";

export const InitialState = () => {
  return {
    type: ActionTypes.INITIAL_STATE
  };
};

export const changeTab = tab => {
  return {
    type: ActionTypes.CHANGE_TAB,
    payload: tab
  };
};
