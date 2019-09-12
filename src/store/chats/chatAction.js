import { ActionTypes } from "../constants";
import { setMessage } from "../../database/realmDatabase";
import { socket } from "../../../App";

export const initialChat = data => dispatch => {
  socket.sendMenssage(JSON.stringify(data));
};

export const getChat = data => dispatch => {
  const parse = JSON.parse(data);
  setMessage("broadcast", parse).then(() => {
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: {
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
