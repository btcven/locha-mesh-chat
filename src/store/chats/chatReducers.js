import { ActionTypes } from "../constants";
import { chats } from "../../utils/constans";

const AplicationState = {
  chat: []
};

export const chatReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return { ...state, chat: action.payload.chats };
    }
    case ActionTypes.NEW_MESSAGE: {
      return {
        ...state,
        chat: [
          {
            ...state.chat[0],
            messages: Object.values(state.chat[0].messages).length
              ? Object.values(state.chat[0].messages).concat(action.payload)
              : [action.payload]
          }
        ]
      };
    }

    case ActionTypes.RELOAD_BROADCAST_CHAT: {
      return { ...state, chat: action.payload };
    }

    case ActionTypes.SELECTED_CHAT: {
      const result = Object.values(state.chat).findIndex(chat => {
        return chat.toUID === action.payload.toUID;
      });
      return {
        ...state,
        seletedChat: { index: result, id: state.chat[result].id }
      };
    }
    default: {
      return state;
    }
  }
};
