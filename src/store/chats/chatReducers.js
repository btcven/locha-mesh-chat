/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  chat: [],
  chatService: false,
  peersConnected: []
};

export const chatReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ALL: {
      return { ...AplicationState };
    }

    case ActionTypes.INITIAL_STATE: {
      return { ...state, chat: action.payload.chats, chatService: true };
    }

    case ActionTypes.ADD_CONTACTS: {
      const payload = action.chat;

      return { ...state, chat: Object.values(state.chat).concat(payload) };
    }

    case ActionTypes.DELETE_CONTACT: {
      const res = Object.values(state.chat).filter((obj) => {
        const result = action.payload.find((payload) => obj.toUID !== payload.uid);

        return result;
      });

      return { ...state, chat: res };
    }

    case ActionTypes.NEW_MESSAGE: {
      const chat = Object.values(state.chat);
      const chatUID = action.payload.toUID ? action.payload.toUID : 'broadcast';
      const chatFromUID = action.payload.fromUID;
      const result = chat.findIndex(
        (chatItem) => chatItem.toUID === chatUID
          || chatItem.toUID === chatFromUID
      );

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
      const result = Object.values(
        state.chat
      ).findIndex(
        (chat) => chat.toUID === action.payload.toUID
      );
      return {
        ...state,
        seletedChat: { index: result, id: state.chat[result].id }
      };
    }

    case ActionTypes.DELETE_MESSAGE: {
      const chats = Object.values(state.chat);
      chats.forEach((chat, key) => {
        action.payload.forEach((payload) => {
          if (payload.toUID === chat.toUID) {
            chats[key].messages = [];
          }
        });
      });

      return { ...state, chat: chats.slice() };
    }

    case ActionTypes.DELETE_ALL_MESSAGE: {
      Object.values(state.chat).forEach((chat, key) => {
        if (chat.toUID === action.payload) {
          state.chat[key].messages = [];
        }
      });
      return { ...state, chat: Object.values(state.chat).slice() };
    }
    case ActionTypes.DELETE_SELECTED_MESSAGE: {
      const chat = state.chat[state.seletedChat.index];
      const messages = Object.values(chat.messages).filter((message) => {
        const res = action.payload.find((payload) => message.id === payload.id);

        return !res;
      });

      state.chat[state.seletedChat.index].messages = messages;

      return { ...state, chat: Object.values(state.chat).slice() };
    }

    case ActionTypes.UNREAD_MESSAGES: {
      state.chat[action.index] = {
        ...state.chat[action.index],
        timestamp: action.time,
        queue: Object.values(state.chat[action.index].queue)
          ? Object.values(state.chat[action.index].queue).concat(action.payload)
          : [action.payload]
      };

      return { ...state, chat: Object.values(state.chat).slice() };
    }

    case ActionTypes.IN_VIEW: {
      const index = Object.values(state.chat).findIndex((chat) => chat.toUID === action.payload);

      if (index !== -1) {
        state.chat[index] = {
          ...state.chat[index],
          queue: []
        };

        return { ...state, chat: Object.values(state.chat) };
      }
      return state;
    }

    case ActionTypes.SET_STATUS_MESSAGE: {
      try {
        const index = Object.values(
          state.chat
        ).findIndex(
          (chat) => chat.toUID === action.payload.fromUID
        );

        if (Array.isArray(action.payload.data.msgID)) {
          // eslint-disable-next-line array-callback-return
          action.payload.data.msgID.map((id) => {
            const messageIndex = Object.values(
              state.chat[index].messages
            ).findIndex((message) => message.id === id);

            state.chat[index].messages[messageIndex].status = action.payload.data.status;
          });
        } else {
          const messageIndex = Object.values(
            state.chat[index].messages
          ).findIndex((message) => message.id === action.payload.data.msgID);

          state.chat[index].messages[messageIndex].status = action.payload.data.status;
        }

        return { ...state, chat: state.chat.slice() };
      } catch (err) {
        const messageIndex = Object.values(state.chat[0].messages).findIndex(
          (message) => message.id === action.payload.data.msgID
        );

        state.chat[0].messages[messageIndex].status = action.payload.data.status;

        return { ...state, chat: state.chat.slice() };
      }
    }

    case ActionTypes.SEND_AGAIN: {
      let index = Object.values(
        state.chat
      ).findIndex(
        (chat) => chat.toUID === action.payload.toUID
      );
      index = index === -1 ? 0 : index;
      const messageIndex = Object.values(state.chat[index].messages).findIndex(
        (message) => message.id === action.payload.id
      );
      state.chat[index].messages[messageIndex].timestamp = action.payload.timestamp;
      state.chat[index].messages[messageIndex].status = 'pending';
      return { ...state, chat: state.chat.slice() };
    }

    case ActionTypes.UPDATE_STATE: {
      return { ...state, chat: state.chat.slice() };
    }

    case ActionTypes.CHAT_SERVICE_STATUS: {
      return { ...state, chatService: action.payload };
    }

    case ActionTypes.NEW_PEER_CONNECTED: {
      return {
        ...state,
        peersConnected: state.peersConnected.concat(action.payload)
      };
    }

    case ActionTypes.REMOVED_PEER: {
      return { ...state, peersConnected: action.payload }
    }

    default: {
      return state;
    }
  }
};
