import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import { ActionTypes } from "../constants";
import { createFolder, FileDirectory } from "../../utils/utils";
import {
  addContacts,
  deleteContact,
  editContact
} from "../../database/realmDatabase";

export const saveContact = (
  id,
  data,
  lastContact,
  callback
) => async dispatch => {
  const newPath = `file:///${FileDirectory}/${data.name}Photo.jpg`;
  if (data.picture) {
    await RNFS.moveFile(data.picture, newPath);
  }
  const obj = [
    {
      ...data,
      picture: !data.picture ? null : newPath
    }
  ];

  addContacts(id, obj).then(res => {
    obj.push(...lastContact);
    dispatch({
      type: ActionTypes.ADD_CONTACTS,
      payload: obj,
      chat: res
    });
    callback();
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

export const deleteContactAction = (data, callback) => dispatch => {
  deleteContact(data.uid).then(res => {
    dispatch({
      type: ActionTypes.DELETE_CONTACT,
      payload: data.uid,
      chat: data.hashUID
    });
  });
};

export const editContats = (obj, callback) => dispatch => {
  editContact(obj).then(res => {
    callback();
    dispatch({
      type: ActionTypes.EDIT_CONTACT,
      payload: res
    });
  });
};
