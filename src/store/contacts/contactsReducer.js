import { ActionTypes } from "../constants";

const AplicationState = {
  contacts: []
};

export const contactsReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_CONTACTS: {
      return { ...state, contacts: action.payload };
    }
    default: {
      return state;
    }
  }
};
