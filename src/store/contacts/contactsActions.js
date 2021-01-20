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

  const newContact = {
    ...data,
    picture: !data.picture ? null : newPath
  };

  database.addContacts(id, newContact).then((res) => {
    dispatch({
      type: ActionTypes.ADD_CONTACTS,
      payload: res,
      chat: {
        fromUID: id,
        toUID: newContact.uid,
        messages: {},
        queue: []
      }
    });
    callback();
  });
};


/**
 * function to delete multiple contacts
 * @param {Array<ContactData>} data data array of a contact
 * @param {callback} callback
 * @function
 * @returns {{type:String  , payload: Object }}
 */

export const deleteContactAction = (data, callback) => async (dispatch) => {
  dispatch({
    type: ActionTypes.DELETE_CONTACT,
    payload: data
  });
  database.deleteContact(data).then(() => {
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
export const editContacts = (obj, callback) => async (dispatch) => {
  database.editContact(obj).then((res) => {
    callback();
    dispatch({
      type: ActionTypes.EDIT_CONTACT,
      payload: res
    });
  });
};
