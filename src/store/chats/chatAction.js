import AsyncStorage from "@react-native-community/async-storage";
import { sendMenssage, onMenssage } from "../../utils/socket";
import { ActionTypes } from "../constants";
import { socket } from "../../../App";

export const initialChat = data => dispatch => {
  socket.sendMenssage(JSON.stringify(data[0]));
};

export const getChat = data => {
  return {
    type: ActionTypes.NEW_MESSAGE,
    payload: JSON.parse(data)
  };
};
