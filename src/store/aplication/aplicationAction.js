import { ActionTypes } from "../constants";
import AsyncStorage from "@react-native-community/async-storage";
import { IntialUser } from "../../utils/constans";
import { createFolder } from "../../utils/utils";
import { writteUser, getUserData } from "../../database/realmDatabase";
import Bitcoin from "../../utils/Bitcoin";

const bitcoin = new Bitcoin();

export const InitialState = () => async dispatch => {
  const result = bitcoin.generateAddress();
  console.log("aca", result.publicKey.toString());
  getUserData().then(async res => {
    if (res.length < 1) {
      await createFolder();
      dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
    } else {
      dispatch(writeAction(IntialUser));
    }
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
