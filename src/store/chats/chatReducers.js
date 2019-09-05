import { ActionTypes } from "../constants";
import { chats } from "../../utils/constans";
const AplicationState = {
  chat: []
};

const setChat = (state, payload) => {
  const newState = state;
  const data = state.seletedChat;
  if (!data.messages.length) {
    data.messages = [payload];
  } else {
    data.messages = data.messages.concat(payload);
  }
  return Object.assign({}, newState, {
    seletedChat: data
  });
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

    case ActionTypes.SELECTED_CHAT: {
      const result = Object.values(state.chat).findIndex(chat => {
        return chat.toUID === chats[0].senderName;
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
