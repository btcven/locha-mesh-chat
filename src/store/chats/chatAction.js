import { ActionTypes } from "../constants";
import { generateName } from "../../utils/utils";
import {
  setMessage,
  addTemporalInfo,
  verifyContact,
  getTemporalContact
} from "../../database/realmDatabase";
import { socket } from "../../../App";
import Identicon from "identicon.js";
import { sha256 } from "js-sha256";
// import Store from "../../store";

const getIcon = data => {
  var icon = new Identicon(data, 420).toString();

  return `data:image/png;base64,${icon}`;
};

export const initialChat = data => dispatch => {
  socket.sendMenssage(JSON.stringify(data));
};

const broadcastRandomData = async parse =>
  new Promise(resolve => {
    console.log(1);
    const store = require("../../store");
    const userData = store.default.getState().config;
    if (sha256(userData.uid) !== parse.fromUID) {
      console.log(2);
      verifyContact(parse.fromUID).then(res => {
        if (res) {
          console.log(3);
          resolve(res);
        } else {
          console.log("wqe");
          getTemporalContact(parse.fromUID).then(temporal => {
            console.log(4);
            if (temporal) {
              resolve(temporal);
            } else {
              console.log(6);
              console.log("entro en el else");
              const randomName = generateName();
              const icon = getIcon(parse.fromUID);
              const obj = {
                hashUID: parse.fromUID,
                name: randomName,
                timestamp: parse.timestamp,
                icon: icon
              };
              addTemporalInfo(obj).then(data => {
                resolve(data);
              });
            }
          });
        }
      });
    }
  });

export const getChat = data => async dispatch => {
  const parse = JSON.parse(data);
  console.log("dios mio", parse);
  let infoMensagge;
  if (!parse.toUID) {
    infoMensagge = await broadcastRandomData(parse);
  }
  setMessage("broadcast", parse).then(() => {
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
        ...infoMensagge,
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
