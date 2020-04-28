import RNFS from 'react-native-fs';
import { sha256 } from 'js-sha256';
import { ActionTypes } from '../constants';
import { FileDirectory, getPhotoBase64, saveImageBase64 } from '../../utils/utils';
import { database } from '../../../App';
import { socket } from '../../utils/socket';
import { messageType } from '../../utils/constans';
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

/**
 * function to delete multiple contacts
 * @param {Array<ContactData>} data data array of a contact
 * @param {callback} callback
 * @function
 * @returns {{type:String  , payload: Object }}
 */

export const deleteContactAction = (data, callback) => async (dispatch) => {
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

export const editContats = (obj, callback) => async (dispatch) => {
  database.editContact(obj).then((res) => {
    callback();
    dispatch({
      type: ActionTypes.EDIT_CONTACT,
      payload: res
    });
  });
};


/**
 * function is executed when adding a contact, it sends a message to the contact
 * requesting your profile picture and sending ours
 * @param {*} uidContact  uid of the new contact added
 */

export const requestImage = (uidContact) => async (dispatch, getState) => {
  const state = getState();
  let imageBase64;
  if (state.config.image) {
    imageBase64 = await getPhotoBase64(state.config.image);
  }
  const sendStatus = {
    fromUID: sha256(state.config.uid),
    timestamp: new Date().getTime(),
    type: messageType.STATUS,
    data: {
      status: 'RequestImage',
      image: imageBase64,
      imageHash: state.config.imageHash
    },
    toUID: uidContact
  };
  socket.sendSocket(JSON.stringify(sendStatus));
};


/**
 * function is executed when adding a contact, it sends a message to the contact
 * requesting your profile picture and sending ours
 * @param {*} uidContact  uid of the new contact added
 */


/**
 * It is executed when the contact's chat is opened,
 * a hash is sent to verify that the contact does not change the image
 * @param {Object} contact contact information ,
 * @param {String} contact.name  contact name
 * @param {String} contact.picture picture contact
 * @param {String} contact.uid uid contact
 * @param {String} contact.hashUID hashUID contact
 * @param {String} contact.imageHash hashUID contact
 *
 */

export const verifyImage = (contact) => (dispatch, getState) => {
  const state = getState();
  const sendStatus = {
    fromUID: sha256(state.config.uid),
    timestamp: new Date().getTime(),
    type: messageType.STATUS,
    data: {
      status: 'verifyHashImage',
      imageHash: contact.imageHash
    },
    toUID: contact.hashUID
  };

  socket.sendSocket(JSON.stringify(sendStatus));
};

/**
 * This function is executed when a requestImage state arrives when adding being added as a contact.
 * Its function is to save the contact image that makes the request and send our image
 * @param {Object} statusData
 * @param {string} statusData.toUID address where the status will be sent
 * @param {string} statusData.fromUID ui of the one that is receiving in state
 * @param {number} statusData.timestamp sent date
 * @param {string} statusData.type type status
 * @param {Object} statusData.data object that contains the status data
 */

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
        type: messageType.STATUS,
        data: {
          status: 'sentImage',
          image: base64Image,
          imageHash: state.config.imageHash
        }
      };
      socket.sendSocket(JSON.stringify(obj));
    }
  });
};

/**
 * This function is executed when a contact sends an image,
 * it is saved and updates the state of the application
 * @param {Object} statusData
 * @param {string} statusData.toUID address where the status will be sent
 * @param {string} statusData.fromUID ui of the one that is receiving in state
 * @param {number} statusData.timestamp sent date
 * @param {string} statusData.type type status
 * @param {Object} statusData.data object that contains the status data
 */

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

/**
 * This function is executed when a contact tries to verify if we have the same perfine image
 * and if not, it is sent again
 * @param {Object} statusData
 * @param {string} statusData.toUID address where the status will be sent
 * @param {string} statusData.fromUID ui of the one that is receiving in state
 * @param {number} statusData.timestamp sent date
 * @param {string} statusData.type type status
 * @param {Object} statusData.data object that contains the status data
 */
export const verifyHashImageStatus = (statusData) => async (getState) => {
  const state = getState();
  if (state.config.imageHash !== statusData.data.imageHash) {
    const base64Image = await getPhotoBase64(state.config.image);
    const obj = {
      fromUID: statusData.toUID,
      toUID: statusData.fromUID,
      timestamp: new Date().getTime(),
      type: messageType.STATUS,
      data: {
        status: 'sentImage',
        image: base64Image,
        imageHash: state.config.imageHash
      }
    };
    socket.sendSocket(JSON.stringify(obj));
  }
};
