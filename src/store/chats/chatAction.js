import { ActionTypes } from "../constants";
import { generateName } from "../../utils/utils";
import {
  setMessage,
  addTemporalInfo,
  verifyContact,
  getTemporalContact
} from "../../database/realmDatabase";
import { sendSocket } from "../../utils/socket";
import { sha256 } from "js-sha256";

export const initialChat = data => dispatch => {
  let uidChat = data.toUID ? data.toUID : "broadcast";
  console.log(uidChat);

  setMessage(uidChat, { ...data }).then(() => {
    sendSocket.send(JSON.stringify(data));
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: undefined,
        ...data,
        msg: data.msg.text
      }
    });
  });
};

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

export const getChat = data => async dispatch => {
  const parse = JSON.parse(data);
  let infoMensagge = undefined;
  if (!parse.toUID) {
    infoMensagge = await broadcastRandomData(parse);
  }

  let uidChat = parse.toUID ? parse.fromUID : "broadcast";

  let name = infoMensagge ? infoMensagge.name : undefined;
  setMessage(uidChat, { ...parse, name: name }).then(() => {
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: name,
        ...parse,
        msg: parse.msg.text
      }
    });
  });
};

export const selectedChat = obj => dispatch => {
  dispatch({
    type: ActionTypes.SELECTED_CHAT,
    payload: obj
  });
};

export const realoadBroadcastChat = data => {
  return {
    type: ActionTypes.RELOAD_BROADCAST_CHAT,
    payload: data
  };
};
