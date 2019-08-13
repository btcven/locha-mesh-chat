import { ActionTypes } from "../constants";
import AsyncStorage from "@react-native-community/async-storage";
import { IntialUser } from "../../utils/constans";
import { createFolder } from "../../utils/utils";

export const InitialState = () => async dispatch => {
  await createFolder()
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
