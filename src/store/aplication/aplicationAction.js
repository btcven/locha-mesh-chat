import { ActionTypes } from "../constants";
import AsyncStorage from "@react-native-community/async-storage";
import { IntialUser } from "../../utils/constans";
import { createFolder } from "../../utils/utils";
import { writteUser, getUserData } from "../../database/realmDatabase";
import Bitcoin from "../../utils/Bitcoin";

const bitcoin = new Bitcoin();

export const InitialState = () => async dispatch => {
  getUserData().then(async res => {
    if (res.length >= 1) {
      dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
    } else {
      dispatch(writeAction(IntialUser));
    }
  });
};

export const setInitialUser = obj => async dispatch => {
  await createFolder();
  const result = bitcoin.generateAddress();
  writteUser({
    uid: result.publicKey.toString(),
    name: obj.name,
    image: null,
    contacts: []
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
