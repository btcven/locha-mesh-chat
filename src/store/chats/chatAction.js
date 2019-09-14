import { ActionTypes } from "../constants";
import { generateName } from "../../utils/utils";
import {
  setMessage,
  addTemporalInfo,
  verifyContact,
  getTemporalContact
} from "../../database/realmDatabase";
import { socket } from "../../../App";
import { sha256 } from "js-sha256";

export const initialChat = data => dispatch => {
  socket.sendMenssage(JSON.stringify(data));
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
  console.log("dios mio", parse);
  let infoMensagge;
  if (!parse.toUID) {
    infoMensagge = await broadcastRandomData(parse);
  }
  setMessage("broadcast", { ...parse, name: infoMensagge.name }).then(() => {
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        name: infoMensagge.name,
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
