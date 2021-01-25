/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  chat: [],
  insideChat: [],
  view: null,
  chatService: false,
  peersConnected: [],
  broadcast: false,
  player: false,
  keyPlayer: null,
  forcedPause: false
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
      return { ...state, chat: state.chat.concat(payload) };
    }

    case ActionTypes.DELETE_CONTACT: {
      const res = state.chat.filter((obj) => {
        const result = action.payload.find((payload) => obj.toUID !== payload.uid);

        return result;
      });

      return { ...state, chat: res };
    }

    case ActionTypes.NEW_MESSAGE: {
      const homeChat = state.chat.findIndex((chat) => chat.toUID === action.payload[0].toUID
        || chat.toUID === action.payload[0].fromUID);

      state.chat[homeChat].messages = [action.payload[0]];
      return {
        ...state, insideChat: action.payload, chat: state.chat.slice()
      };
    }

    case ActionTypes.RELOAD_BROADCAST_CHAT: {
      return { ...state, chat: action.payload };
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
      const index = state.chat.findIndex((chat) => {
        return chat.toUID === action.payload;
      });
      state.chat[index].messages = [];
      return { ...state, insideChat: [], chat: state.chat.slice() };
    }
    case ActionTypes.DELETE_SELECTED_MESSAGE: {
      const messages = state.insideChat.filter((message) => {
        const res = action.payload.find((payload) => message.id === payload.id);
        return !res;
      });

      return { ...state, insideChat: messages };
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
      const index = state.chat.findIndex((chat) => {
        return chat.toUID === action.payload;
      });
      if (index !== -1) {
        state.chat[index].queue = [];
      }
      return {
        ...state,
        insideChat: action.messages,
        chat: state.chat.slice()
      };
    }

    case ActionTypes.SET_STATUS_MESSAGE: {
      state.insideChat[0] = action.payload;
      return { ...state, insideChat: state.insideChat.slice() };
    }

    case ActionTypes.SEND_AGAIN: {
      const index = state.insideChat.findIndex(
        (chat) => chat.id === action.payload.id
      );

      state.insideChat[index] = action.payload;
      return { ...state, insideChat: state.insideChat.slice() };
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
      return { ...state, peersConnected: action.payload };
    }

    case ActionTypes.ENABLE_BROADCAST: {
      return { ...state, broadcast: true };
    }

    case ActionTypes.DISABLE_BROADCAST: {
      return { ...state, broadcast: false };
    }

    case ActionTypes.MESSAGE_IS_PLAYING: {
      return {
        ...state,
        keyPlayer: action.payload.keyPlayer,
        player: action.payload.isPlaying
      };
    }
    case ActionTypes.STOP_PLAYBACK: {
      return {
        ...state,
        keyPlayer: null,
        player: false
      };
    }

    case ActionTypes.STOP_PLAYING: {
      return {
        ...state,
        forcedPause: action.payload
      };
    }

    case ActionTypes.GET_MORE_MESSAGES: {
      return {
        ...state, insideChat: action.payload
      };
    }

    default: {
      return state;
    }
  }
};
