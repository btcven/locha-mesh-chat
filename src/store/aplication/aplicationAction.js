import { ActionTypes } from "../constants";
import { createFolder } from "../../utils/utils";
import { writteUser, getUserData } from "../../database/realmDatabase";
import Bitcoin from "../../utils/Bitcoin";
import Socket from "../../utils/socket";
import store from "../../store";
import { broadcastRandomData } from "../chats";

const bitcoin = new Bitcoin();

let ws = Socket;

export const InitialState = () => async dispatch => {
  getUserData().then(async res => {
    if (res.length >= 1) {
      dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
    }
  });
};

export const setInitialUser = obj => async dispatch => {
  await createFolder();
  const result = await bitcoin.generateAddress();
  writteUser({
    uid: result.publicKey.toString(),
    name: obj.name,
    image: null,
    contacts: [],
    chats: [
      {
        fromUID: result.publicKey.toString(),
        toUID: "broadcast",
        messages: []
      }
    ]
  }).then(res => {
    dispatch(writeAction(res));
  });
};

const writeAction = data => {
  return {
    type: ActionTypes.INITIAL_STATE,
    payload: data
  };
};

export const setView = view => {
  return {
    type: ActionTypes.IN_VIEW,
    payload: view
  };
};

export const changeTab = tab => {
  return {
    type: ActionTypes.CHANGE_TAB,
    payload: tab
  };
};

export const loading = () => {
  return {
    type: ActionTypes.LOADING_ON
  };
};

export const loaded = () => {
  return {
    type: ActionTypes.LOADING_OFF
  };
};

export const reestarConnection = () => {
  ws = new Socket(store);
};
