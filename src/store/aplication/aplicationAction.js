import { ActionTypes } from "../constants";
import AsyncStorage from "@react-native-community/async-storage";
import { IntialUser } from "../../utils/constans";
import { createFolder } from "../../utils/utils";
import { writteUser, getUserData } from "../../database/realmDatabase";

export const InitialState = () => async dispatch => {
  let result = await getUserData();
  console.log("en la action", result);
  await createFolder();
  console.log("stryngify", JSON.stringify(IntialUser));
  const user = await AsyncStorage.getItem("user");
  if (!user) {
    await AsyncStorage.setItem("user", JSON.stringify(IntialUser));
  } else {
    dispatch({
      type: ActionTypes.INITIAL_STATE,
      payload: JSON.parse(user)
    });
  }
};

export const changeTab = tab => {
  return {
    type: ActionTypes.CHANGE_TAB,
    payload: tab
  };
};
