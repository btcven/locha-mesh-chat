import { ActionTypes } from "../constants";

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
        seletedChat: {
          ...state.seletedChat,
          messages: state.seletedChat.messages.length
            ? state.seletedChat.messages.concat(action.payload)
            : [action.payload]
        }
      };
    }

    case ActionTypes.SELECTED_CHAT: {
      return { ...state, seletedChat: action.payload };
    }
    default: {
      return state;
    }
  }
};
