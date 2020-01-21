import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import { ActionTypes } from '../constants';
import { FileDirectory } from '../../utils/utils';
import { database } from '../../../App';

/**
 * here are all the actions references to contacts
 * @module ContactAction
 */

/**
 * @function
 * @param {string} id user id
 * @param {Object} data contact information to save
 * @param {String} data.name photo of the new contact
 * @param {String} data.picture picture of the new contact
 * @param {String} data.uid uid of the new contact
 * @param {String} data.hashUID hashUID of the new contact
 * @param {callback} callback
 * @param {Array<Object>} lastContact array of existing contacts
 * @returns {{type:String  , payload: Object }}
 */

export const saveContact = (
  id,
  data,
  lastContact,
  callback
) => async (dispatch) => {
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

  database.addContacts(id, obj).then((res) => {
    obj.push(...lastContact);
    dispatch({
      type: ActionTypes.ADD_CONTACTS,
      payload: obj,
      chat: res
    });
    callback();
  });
};

/**
 * function to get all contacts
 * @function
 * @returns {Object}
 */

export const getContacts = () => async (dispatch) => {
  const contacts = await AsyncStorage.getItem('contacts');
  dispatch({
    type: ActionTypes.ADD_CONTACTS,
    payload: contacts ? Object.values(JSON.parse(contacts)) : []
  });
};

/**
 * function to delete multiple contacts
 * @param {Array<ContactData>} data data array of a contact
 * @param {callback} callback
 * @function
 * @returns {{type:String  , payload: Object }}
 */

export const deleteContactAction = (data, callback) => (dispatch) => {
  database.deleteContact(data).then(() => {
    dispatch({
      type: ActionTypes.DELETE_CONTACT,
      payload: data
    });
    callback();
  });
};

/**
 * function used to edit contacts
 * @param {Object} contact information to edit
 * @function
 * @param {callback} callback
 * @returns {{type:String  , payload: Object }}
 */

export const editContats = (obj, callback) => (dispatch) => {
  database.editContact(obj).then((res) => {
    callback();
    dispatch({
      type: ActionTypes.EDIT_CONTACT,
      payload: res
    });
  });
};
