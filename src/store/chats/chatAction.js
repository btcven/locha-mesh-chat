import { ActionTypes } from "../constants";
import { generateName } from "../../utils/utils";
import {
  setMessage,
  addTemporalInfo,
  verifyContact,
  getTemporalContact,
  deleteChatss,
  cleanChat
} from "../../database/realmDatabase";
import { notification, FileDirectory } from "../../utils/utils";
import { sendSocket } from "../../utils/socket";
import { sha256 } from "js-sha256";
import RNFS from "react-native-fs";

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

export const initialChat = data => dispatch => {
  let uidChat = data.toUID ? data.toUID : "broadcast";
  setMessage(uidChat, { ...data }).then(() => {
    sendSocket.send(JSON.stringify(data));
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: undefined,
        ...data,
        msg: data.msg.text,
        id: data.msgID
      }
    });
  });
};

/**
 * @function
 * @description function to save random name or contact name (if it exists) to be shown on public channels
 * @param {object} parse Information about the message
 * @param {string} parse.toUID address where the message will be sent
 * @param {string} parse.fromUID uid who is sending the message
 * @param {object} parse.msg  message content
 * @param {number} parse.timestamp sent date
 * @param  {string}parse.type type message
 * @param {string} id id user
 * @returns {object}
 */

export const broadcastRandomData = async (parse, id) =>
  new Promise(resolve => {
    const store = require("../../store");
    const userData = id ? id : store.default.getState().config.uid;
    if (sha256(userData) !== parse.fromUID) {
      verifyContact(parse.fromUID).then(res => {
        if (res) {
          resolve(res);
        } else {
          getTemporalContact(parse.fromUID).then(temporal => {
            if (temporal) {
              resolve(temporal);
            } else {
              const randomName = generateName();
              const obj = {
                hashUID: parse.fromUID,
                name: randomName,
                timestamp: parse.timestamp
              };
              addTemporalInfo(obj).then(data => {
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
 * @description This function is executed every time a new message arrives from the socket and saves it in the database.
 * @param {object} data Information about the message
 * @param {string} data.toUID address where the message will be sent
 * @param {string} data.fromUID uid who is sending the message
 * @param {object} data.msg  message content
 * @param {number} data.timestamp sent date
 * @param  {string} data.type type message
 * @returns {object}
 */

export const getChat = data => async dispatch => {
  const parse = JSON.parse(data);
  let math = undefined;

  let infoMensagge = undefined;
  if (!parse.toUID) {
    infoMensagge = await broadcastRandomData(parse);
  }

  if (parse.msg.file) {
    parse.msg.file = await saveFile(parse.msg);
  }

  let uidChat = parse.toUID ? parse.fromUID : "broadcast";

  let name = infoMensagge ? infoMensagge.name : undefined;
  setMessage(uidChat, { ...parse, name: name }).then(file => {
    console.log("acaaa", file);
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: name,
        ...parse,
        msg: parse.msg.text,
        id: parse.msgID,
        file: file
      }
    });
  });
};

/**
 * save the images in the phone memory
 * @param {Object} obj
 * @returns {Promise<string>}
 */
const saveFile = obj =>
  new Promise(resolve => {
    if (obj.typeFile === "image") {
      const base64File = obj.file;
      const name = `IMG_${new Date().getTime()}`;
      const directory = `file:///${FileDirectory}/Pictures/${name}.jpg`;
      RNFS.writeFile(directory, base64File, "base64").then(res => {
        resolve(directory);
      });
    } else {
      const base64File = obj.file;
      const name = `AUDIO_${new Date().getTime()}`;
      const directory = `file:///${FileDirectory}/Audios/${name}.aac`;
      RNFS.writeFile(directory, base64File, "base64").then(res => {
        resolve(directory);
      });
    }
  });

/**
 * @function
 * @description This function is executed every time a new message arrives from the socket and saves it in the database.
 * @param {object} data Information about the message
 * @param {string} data.toUID address where the message will be sent
 * @param {string} data.fromUID uid who is sending the message
 * @param {object} data.msg  message content
 * @param {number} data.timestamp sent date
 * @param  {string} data.type type message
 * @returns {object}
 */

export const selectedChat = obj => dispatch => {
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

export const realoadBroadcastChat = data => {
  return {
    type: ActionTypes.RELOAD_BROADCAST_CHAT,
    payload: data
  };
};

/**
 * @function
 * @description delete messages from a specific chat
 * @param {obj} obj
 * @param {callback} callback
 */

export const deleteChat = (obj, callback) => dispatch => {
  deleteChatss(obj).then(() => {
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

export const cleanAllChat = id => dispatch => {
  cleanChat(id).then(() => {
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

export const sendMessageWithFile = (data, path, base64) => dispatch => {
  let uidChat = data.toUID ? data.toUID : "broadcast";
  const saveDatabase = Object.assign({}, data);
  saveDatabase.msg.file = path;
  setMessage(uidChat, { ...saveDatabase }).then(file => {
    saveDatabase.msg.file = base64;
    sendSocket.send(JSON.stringify(saveDatabase));
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: undefined,
        ...data,
        msg: data.msg.text,
        id: data.msgID,
        file: file
      }
    });
  });
};

export const sendMessagesWithSound = (data, path, base64) => dispatch => {
  console.log("err webo", data, path, base64);
  // let uidChat = data.toUID ? data.toUID : "broadcast";
  // const saveDatabase = Object.assign({}, data);
  // saveDatabase.msg.file = path;
  // setMessage(uidChat, { ...saveDatabase }).then(file => {
  //   saveDatabase.msg.file = base64;
  //   sendSocket.send(JSON.stringify(saveDatabase));
  //   dispatch({
  //     type: ActionTypes.NEW_MESSAGE,
  //     payload: {
  //       name: undefined,
  //       ...data,
  //       msg: data.msg.text,
  //       id: data.msgID,
  //       file: file
  //     }
  //   });
  // });
};
