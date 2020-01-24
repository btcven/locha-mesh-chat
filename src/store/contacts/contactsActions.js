import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import { sha256 } from 'js-sha256';
import { ActionTypes } from '../constants';
import { FileDirectory, getPhotoBase64, saveImageBase64 } from '../../utils/utils';
import { database } from '../../../App';
import { sendSocket } from '../../utils/socket';
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

export const requestImage = (uidContact) => async (dispatch, getState) => {
  const state = getState();
  let imageBase64;
  if (state.config.image) {
    imageBase64 = await getPhotoBase64(state.config.image);
  }
  const sendStatus = {
    fromUID: sha256(state.config.uid),
    timestamp: new Date().getTime(),
    type: 'status',
    data: {
      status: 'RequestImage',
      image: imageBase64,
      imageHash: state.config.imageHash
    },
    toUID: uidContact
  };
  sendSocket.send(JSON.stringify(sendStatus));
};

export const verifyImage = (contact) => (dispatch, getState) => {
  const state = getState();
  const sendStatus = {
    fromUID: sha256(state.config.uid),
    timestamp: new Date().getTime(),
    type: 'status',
    data: {
      status: 'verifyHashImage',
      imageHash: contact.imageHash
    },
    toUID: contact.hashUID
  };

  sendSocket.send(JSON.stringify(sendStatus));
};

export const requestImageStatus = (statusData) => (dispatch, getState) => {
  const state = getState();
  database.verifyContact(statusData.fromUID).then(async (verify) => {
    if (verify) {
      if (verify.imageHash !== statusData.data.imageHash) {
        saveImageBase64(statusData.data.image).then((imagePath) => {
          database.savePhotoContact(
            statusData.fromUID,
            imagePath,
            statusData.data.imageHash
          ).then(() => {
            dispatch({
              type: ActionTypes.SAVE_PHOTO,
              payload: imagePath,
              id: statusData.fromUID,
              imageHash: statusData.data.imageHash
            });
          });
        });
      }
      const base64Image = await getPhotoBase64(state.config.image);
      const obj = {
        fromUID: statusData.toUID,
        toUID: statusData.fromUID,
        timestamp: new Date().getTime(),
        type: 'status',
        data: {
          status: 'sentImage',
          image: base64Image,
          imageHash: state.config.imageHash
        }
      };
      sendSocket.send(JSON.stringify(obj));
    }
  });
};

export const sentImageStatus = (statusData) => (dispatch) => {
  saveImageBase64(statusData.data.image).then((imagePath) => {
    database.savePhotoContact(statusData.fromUID, imagePath, statusData.data.imageHash).then(() => {
      dispatch({
        type: ActionTypes.SAVE_PHOTO,
        payload: imagePath,
        id: statusData.fromUID,
        imageHash: statusData.data.imageHash
      });
    });
  });
};

export const verifyHashImageStatus = (statusData) => async (getState) => {
  const state = getState();
  if (state.config.imageHash !== statusData.data.imageHash) {
    const base64Image = await getPhotoBase64(state.config.image);
    const obj = {
      fromUID: statusData.toUID,
      toUID: statusData.fromUID,
      timestamp: new Date().getTime(),
      type: 'status',
      data: {
        status: 'sentImage',
        image: base64Image,
        imageHash: state.config.imageHash
      }
    };
    sendSocket.send(JSON.stringify(obj));
  }
};
