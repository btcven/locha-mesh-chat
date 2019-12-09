import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import { ActionTypes } from "../constants";
import { createFolder } from "../../utils/utils";
import { database } from '../../../App'
import { writteUser, getUserData } from "../../database/realmDatabase";

/**
 * in this module are the configuration actions
 * @module ConfigurationAction
 */

/**
 * @function
 * @description function to get the photo of the gallery cut and move to the app folder
 * @param {string} id user id
 * @param {callback} callback
 */

export const getPhotosFromUser = (id, callback) => async dispatch => {
  const directory = await createFolder();
  ImagePicker.openPicker({
    cropping: true,
    width: 500,
    height: 500
  }).then(async images => {
    const name = await getName(images);
    const newPath = `file:///${directory}/${name}`;
    RNFS.moveFile(images.path, newPath).then(async res => {
      await deletePhotoFromPhone();
      database.writteUser({ uid: id, picture: newPath }).then(async res => {
        callback();
        dispatch({
          type: ActionTypes.GET_PHOTO_USER,
          payload: res.picture
        });
      });
    });
  });
};

/**
 * @function
 * @description function to get the photo of the gallery cut and move to the app folder
 * @param {object} id information of the photograph obtained
 * @returns {string}
 */

const getName = data => {
  const result = data.path.split("/");
  return result[7];
};

/**
 * @function
 * @description verify that the user has a photo added and if it exists, delete it
 *
 */

const deletePhotoFromPhone = async () => {
  database.getUserData("user").then(async res => {
    const parse = JSON.parse(JSON.stringify(res));
    if (parse.picture) {
      await RNFS.exists(parse.picture).then(async res => {
        if (res) {
          await RNFS.unlink(parse.picture);
        }
      });
    }
  });
};
/**
 *
 * @description activate the phone's camera, cut the photo and move it to the folder
 * @param {string}  id user id
 * @param {callback} callback
 */

export const openCamera = (id, callback) => async dispatch => {
  const directory = await createFolder()
  ImagePicker.openCamera({
    width: 500,
    height: 500,
    cropping: true
  }).then(async images => {
    const name = await getName(images);
    const newPath = `file:///${directory}/${name}`;
    RNFS.moveFile(images.path, newPath).then(async () => {
      await deletePhotoFromPhone();
      database.writteUser({
        uid: id,
        picture: newPath
      }).then(async res => {
        callback();
        dispatch({
          type: ActionTypes.GET_PHOTO_USER,
          payload: res.picture
        });
      });
    });
  });
};

/**
 *
 * @description save the name of the user in the database
 * @param {object} obj  user information
 * @param {string} obj.name  User name
 * @param {string} obj.uid   User uid
 * @param {string | null} obj.picture  user profile picture
 * @param {callback} callback
 */

export const editName = (obj, callback) => async dispatch => {
  database.writteUser({ ...obj, id: obj.uid }).then(res => {
    callback();
    dispatch({
      type: ActionTypes.EDIT_NAME,
      payload: res.name
    });
  });
};


