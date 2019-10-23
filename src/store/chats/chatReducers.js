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

    case ActionTypes.ADD_CONTACTS: {
      const payload = action.chat;
      return { ...state, chat: Object.values(state.chat).concat(payload) };
    }

    case ActionTypes.DELETE_CONTACT: {
      const result = Object.values(state.chat).filter(obj => {
        return obj.toUID !== action.chat;
      });

      return { ...state, chat: result };
    }

    case ActionTypes.NEW_MESSAGE: {
      const chat = Object.values(state.chat);
      chatUID = action.payload.toUID ? action.payload.toUID : "broadcast";
      chatFromUID = action.payload.fromUID;
      const result = chat.findIndex(chat => {
        return chat.toUID === chatUID || chat.toUID === chatFromUID;
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

    case ActionTypes.DELETE_MESSAGE: {
      const chats = Object.values(state.chat);
      chats.map((chat, key) => {
        action.payload.map(payload => {
          if (payload.toUID === chat.toUID) {
            chats[key].messages = [];
          }
        });
      });

      return { chat: chats.slice() };
    }

    case ActionTypes.DELETE_ALL_MESSAGE: {
      Object.values(state.chat).map((chat, key) => {
        if (chat.toUID === action.payload) {
          state.chat[key].messages = [];
        }
      });
      return { ...state, chat: Object.values(state.chat).slice() };
    }
    default: {
      return state;
    }
  }
};
