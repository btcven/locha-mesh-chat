import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import { ActionTypes } from "../constants";
import { createFolder, FileDirectory } from "../../utils/utils";

export const saveContact = (data, lastContact, callback) => async dispatch => {
  const newPath = `file:///${FileDirectory}/${data.name}Photo.jpg`;
  if (data.image) {
    await RNFS.moveFile(data.image, newPath);
  }
  const obj = [
    {
      ...data,
      image: !data.image ? null : newPath
    }
  ];

  obj.push(...lastContact);
  await AsyncStorage.setItem("contacts", JSON.stringify({ ...obj }));
  callback();
  dispatch({
    type: ActionTypes.ADD_CONTACTS,
    payload: obj
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
