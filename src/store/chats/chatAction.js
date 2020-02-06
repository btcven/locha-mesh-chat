import { sha256 } from 'js-sha256';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { ActionTypes } from '../constants';
import {
  generateName, notification, FileDirectory,
} from '../../utils/utils';
import { database } from '../../../App';
import { sendSocket } from '../../utils/socket';

/**
 *here are all the actions of sending and receiving messages
 *@module ChatAction
 */

/**
 * @function
 * @description send the messages to the socket and save them in the database
 * @param {object} data Information about the chat
 * @param {string} data.toUID address where the message will be sent
 * @param {string} data.fromUID uid who is sending the message
 * @param {object} data.msg  message content
 * @param {number} timestamp sent date
 * @param  {string} type type message
 * @returns {object}
 */

export const initialChat = (data, status) => async (dispatch) => {
  const uidChat = data.toUID ? data.toUID : 'broadcast';
  database.setMessage(uidChat, { ...data }, status).then((res) => {

    if (!process.env.JEST_WORKER_ID) {
      sendSocket.send(JSON.stringify(data));
    }

    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: undefined,
        ...data,
        time: res.time,
        shippingTime: res.time,
        msg: data.msg.text,
        id: data.msgID,
        status
      }
    });
  });
};

/**
 * @function
 * @description function to save random name or contact name (if it exists)
 *  to be shown on public channels
 * @param {object} parse Information about the message
 * @param {string} parse.toUID address where the message will be sent
 * @param {string} parse.fromUID uid who is sending the message
 * @param {object} parse.msg  message content
 * @param {number} parse.timestamp sent date
 * @param  {string}parse.type type message
 * @param {string} id id user
 * @returns {object}
 */

export const broadcastRandomData = async (parse, id) => new Promise((resolve) => {
  // eslint-disable-next-line global-require
  const store = require('../../store');
  const userData = id || store.default.getState().config.uid;
  if (sha256(userData) !== parse.fromUID) {
    database.verifyContact(parse.fromUID).then((res) => {
      if (res) {
        resolve(res);
      } else {
        database.getTemporalContact(parse.fromUID).then((temporal) => {
          if (temporal) {
            resolve(temporal);
          } else {
            const randomName = generateName();
            const obj = {
              hashUID: parse.fromUID,
              name: randomName,
              timestamp: parse.timestamp
            };
            database.addTemporalInfo(obj).then((data) => {
              resolve(data);
            });
          }
        });
      }
    });
  } else {
    resolve({ name: undefined });
  }
});

/**
 * @function
 * @description This function is executed every time a new message arrives
 * from the socket and saves it in the database.
 * @param {object} data Information about the message
 * @param {string} data.toUID address where the message will be sent
 * @param {string} data.fromUID uid who is sending the message
 * @param {object} data.msg  message content
 * @param {number} data.timestamp sent date
 * @param  {string} data.type type message
 * @returns {object}
 */
export const getChat = (parse) => async (dispatch) => {
  let infoMensagge;
  sendStatus(parse);
  if (!parse.toUID) {
    infoMensagge = await broadcastRandomData(parse);
  }
  if (parse.msg.file) {
    parse.msg.file = await saveFile(parse.msg);
  }
  const uidChat = parse.toUID ? parse.fromUID : 'broadcast';
  const name = infoMensagge ? infoMensagge.name : undefined;
  database.setMessage(uidChat, { ...parse, name }, 'delivered').then((res) => {
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name,
        ...parse,
        msg: parse.msg.text,
        id: parse.msgID,
        file: res.file,
        time: res.time
      }
    });
  });
};


export const setStatusMessage = (statusData) => (dispatch) => {
  database.addStatusOnly(statusData).then(() => {
    dispatch({
      type: ActionTypes.SET_STATUS_MESSAGE,
      payload: statusData
    });
  });
};

/**
 * save the files in the phone memory
 * @param {Object} obj
 * @returns {Promise<string>}
 */
const saveFile = (obj) => new Promise((resolve) => {
  const connectiveAddress = Platform.OS === 'android' ? 'file:///' : '';
  if (obj.typeFile === 'image') {
    const base64File = obj.file;
    const name = `IMG_${new Date().getTime()}`;

    const directory = `${connectiveAddress}${FileDirectory}/Pictures/${name}.jpg`.trim();
    RNFS.writeFile(directory, base64File, 'base64').then(() => {
      resolve(directory);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
  } else {
    const base64File = obj.file;
    const name = `AUDIO_${new Date().getTime()}`;
    const directory = `${FileDirectory}/${name}.aac`;
    RNFS.writeFile(`${connectiveAddress}${directory}`, base64File, 'base64').then(() => {
      resolve(`${connectiveAddress}${directory}`);
    });
  }
});

/**
 * @function
 * @description This function is executed every time a new message arrives
 * from the socket and saves it in the database.
 * @param {object} data Information about the message
 * @param {string} data.toUID address where the message will be sent
 * @param {string} data.fromUID uid who is sending the message
 * @param {object} data.msg  message content
 * @param {number} data.timestamp sent date
 * @param  {string} data.type type message
 * @returns {object}
 */

export const selectedChat = (obj) => (dispatch) => {
  notification.cancelAll();
  dispatch({
    type: ActionTypes.SELECTED_CHAT,
    payload: obj
  });
};

/**
 * @function
 * @description reload the state of the public chats once the messages are deleted
 * @param {object} data Information about the chat
 * @returns {object}
 */

export const realoadBroadcastChat = (data) => ({
  type: ActionTypes.RELOAD_BROADCAST_CHAT,
  payload: data
});

/**
 * @function
 * @description delete messages from a specific chat
 * @param {obj} obj
 * @param {callback} callback
 */

export const deleteChat = (obj, callback) => (dispatch) => {
  database.deleteChatss(obj).then(() => {
    dispatch({
      type: ActionTypes.DELETE_MESSAGE,
      payload: obj
    });
    callback();
  });
};

/**
 * @function
 * @description delete all messages from a specific chat
 * @param {string} id
 */

export const cleanAllChat = (id) => (dispatch) => {
  database.cleanChat(id).then(() => {
    dispatch({
      type: ActionTypes.DELETE_ALL_MESSAGE,
      payload: id
    });
  });
};

/**
 *
 * sending images with files
 * @function
 * @param {Object} data
 * @param {String} path
 * @param {String} base64
 */

export const sendMessageWithFile = (data, path, base64) => (dispatch) => {
  const uidChat = data.toUID ? data.toUID : 'broadcast';
  const saveDatabase = { ...data };
  saveDatabase.msg.file = path;
  database.setMessage(uidChat, { ...saveDatabase }, 'pending').then((res) => {
    saveDatabase.msg.file = base64;
    sendSocket.send(JSON.stringify(saveDatabase));
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: undefined,
        ...data,
        msg: data.msg.text,
        id: data.msgID,
        file: res.file,
        shippingTime: res.time,
        status: 'pending'
      }
    });
  });
};

export const deleteMessages = (id, data, callback) => (dispatch) => {
  database.deleteMessage(id, data).then(() => {
    dispatch({
      type: ActionTypes.DELETE_SELECTED_MESSAGE,
      id,
      payload: data
    });
    callback();
  });
};

export const messageQueue = (index, id, view) => (dispatch) => {
  database.unreadMessages(view, id).then((time) => {
    dispatch({
      type: ActionTypes.UNREAD_MESSAGES,
      index,
      payload: id,
      time
    });
  });
};

export const sendStatus = (data) => {
  // eslint-disable-next-line global-require
  const store = require('../../store');
  const state = store.default.getState();
  // eslint-disable-next-line no-shadow
  const sendStatus = {
    fromUID: state.config.uid,
    timestamp: new Date().getTime(),
    data: {
      status: 'delivered',
      msgID: data.msgID
    },
    type: 'status'
  };

  if (!data.toUID) {
    sendStatus.toUID = null;
    sendSocket.send(JSON.stringify(sendStatus));
  } else {
    try {
      const contacts = Object.values(state.contacts.contacts);

      contacts.forEach((contact) => {
        if (data.fromUID === contact.hashUID) {
          sendStatus.toUID = contact.hashUID;

          sendSocket.send(JSON.stringify(sendStatus));
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('entro en el catch', err);
    }
  }
};

/**
 * @function
 * @description Identify if we have an open chat so that notifications do not arrive
 * @param {string} idChat
 * @returns {object}
 */

export const setView = (idChat) => (dispatch) => {
  database.cancelUnreadMessages(idChat).then((res) => {
    // eslint-disable-next-line global-require
    const store = require('../../store');
    const state = store.default.getState();

    if (idChat && res.length > 0) {
      const chat = Object.values(state.chats.chat).find((itemChat) => itemChat.toUID === idChat);

      // eslint-disable-next-line no-shadow
      const sendStatus = {
        fromUID: state.config.uid,
        toUID: chat.toUID,
        timestamp: new Date().getTime(),
        data: {
          status: 'read',
          msgID: res
        },
        type: 'status'
      };
      sendSocket.send(JSON.stringify(sendStatus));
    }

    dispatch({
      type: ActionTypes.IN_VIEW,
      payload: idChat
    });
  });
};

export const sendReadMessageStatus = (data) => () => {
  sendSocket.send(JSON.stringify(data));
};

export const sendAgain = (message) => (dispatch) => {
  database.updateMessage(message).then((res) => {
    const sendObject = {
      fromUID: res.fromUID,
      toUID: res.toUID,
      msg: {
        text: res.msg
      },
      timestamp: res.timestamp,
      type: res.type,
      msgID: res.id,
      shippingTime: res.shippingTime
    };

    sendSocket.send(JSON.stringify(sendObject));
    dispatch({
      type: ActionTypes.SEND_AGAIN,
      payload: message
    });
  });
};

export const updateState = () => ({
  type: ActionTypes.UPDATE_STATE
});
