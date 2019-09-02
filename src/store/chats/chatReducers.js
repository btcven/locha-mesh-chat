import { ActionTypes } from "../constants";

const AplicationState = {
  chat: []
};

export const chatReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.NEW_MESSAGE: {
      return { ...state, chat: state.chat.concat(action.payload) };
    }
    default: {
      return state;
    }
  }
};
