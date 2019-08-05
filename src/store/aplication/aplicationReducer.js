import { ActionTypes } from "../constants";

const AplicationState = {
  aplication: true
};

export const AplicationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return { ...state };
    }
    default: {
      return state;
    }
  }
};
