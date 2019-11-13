import { ActionTypes } from "../constants";
import { chats } from "../../utils/constans";
import { sha256 } from "js-sha256";

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
      const res = Object.values(state.chat).filter(obj => {
        const result = action.payload.find(payload => {
          console.log(obj.toUID, payload.hashUID);
          return obj.toUID !== payload.hashUID;
        });

        return result;
      });

      return { ...state, chat: res };
    }

    case ActionTypes.NEW_MESSAGE: {
      const chat = Object.values(state.chat);
      chatUID = action.payload.toUID ? action.payload.toUID : "broadcast";
      chatFromUID = action.payload.fromUID;
      const result = chat.findIndex(chat => {
        return chat.toUID === chatUID || chat.toUID === chatFromUID;
      });

      chat[result].timestamp = action.payload.time;
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

      return { ...state, chat: chats.slice() };
    }

    case ActionTypes.DELETE_ALL_MESSAGE: {
      Object.values(state.chat).map((chat, key) => {
        if (chat.toUID === action.payload) {
          state.chat[key].messages = [];
        }
      });
      return { ...state, chat: Object.values(state.chat).slice() };
    }
    case ActionTypes.DELETE_SELECTED_MESSAGE: {
      const chat = state.chat[state.seletedChat.index];
      const messages = Object.values(chat.messages).filter(message => {
        const res = action.payload.find(payload => {
          return message.id === payload.id;
        });

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
      const index = Object.values(state.chat).findIndex(chat => {
        return chat.toUID === action.payload;
      });

      if (index !== -1) {
        state.chat[index] = {
          ...state.chat[index],
          queue: []
        };

        return { ...state, chat: Object.values(state.chat) };
      } else {
        return state;
      }
    }

    case ActionTypes.SET_STATUS_MESSAGE: {
      try {
        const index = Object.values(state.chat).findIndex(chat => {
          return chat.toUID === sha256(action.payload.fromUID);
        });

        if (Array.isArray(action.payload.data.msgID)) {
          action.payload.data.msgID.map((id, key) => {
            const messageIndex = Object.values(
              state.chat[index].messages
            ).findIndex(message => {
              return message.id === id;
            });

            state.chat[index].messages[messageIndex].status =
              action.payload.data.status;
          });
        } else {
          const messageIndex = Object.values(
            state.chat[index].messages
          ).findIndex(message => {
            return message.id === action.payload.data.msgID;
          });

          state.chat[index].messages[messageIndex].status =
            action.payload.data.status;
        }

        return { ...state, chat: state.chat.slice() };
      } catch (err) {
        const messageIndex = Object.values(state.chat[0].messages).findIndex(
          message => {
            return message.id === action.payload.data.msgID;
          }
        );

        state.chat[0].messages[messageIndex].status =
          action.payload.data.status;

        return { ...state, chat: state.chat.slice() };
      }
    }

    case ActionTypes.SEND_AGAIN: {
      let index = Object.values(state.chat).findIndex(chat => {
        return chat.toUID === action.payload.toUID;
      });

      index = index === -1 ? 0 : index;

      const messageIndex = Object.values(state.chat[index].messages).findIndex(
        message => {
          return message.id === action.payload.id;
        }
      );

      state.chat[index].messages[messageIndex].timestamp =
        action.payload.timestamp;
      state.chat[index].messages[messageIndex].status = "pending";

      return { ...state, chat: state.chat.slice() };
    }

    case ActionTypes.UPDATE_STATE: {
      return { ...state, chat: state.chat.slice() };
    }

    default: {
      return state;
    }
  }
};
