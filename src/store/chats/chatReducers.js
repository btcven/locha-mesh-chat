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
      const chat = Object.values(state.chat);
      chatUID = action.payload.toUID ? action.payload.toUID : "broadcast";
      const result = chat.findIndex(chat => {
        return chat.toUID === chatUID;
      });

      const messages = Object.values(chat[result].messages);
      chat[result].messages = messages.length
        ? messages.concat(action.payload)
        : [action.payload];

      return { ...state, chat: chat.slice() };
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
