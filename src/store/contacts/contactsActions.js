import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import { ActionTypes } from "../constants";
import { createFolder, FileDirectory } from "../../utils/utils";

export const saveContact = data => dispatch => {
  const newPath = `file:///${FileDirectory}/${data.name}Photo.jpg`;
  RNFS.moveFile(data.image, newPath).then(async () => {
    const obj = [
      {
        ...data,
        image: newPath
      }
    ];
    await AsyncStorage.setItem("contacts", JSON.stringify({ ...obj }));
    dispatch({
      type: ActionTypes.ADD_CONTACTS,
      payload: obj
    });
  });
};

export const getContacts = () => async dispatch => {
  const contacts = await AsyncStorage.getItem("contacts");
  parse = JSON.parse(contacts);
  dispatch({
    type: ActionTypes.ADD_CONTACTS,
    payload: contacts ? Object.values(JSON.parse(contacts)) : []
  });
};
