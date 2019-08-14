import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import { ActionTypes } from "../constants";
import { createFolder } from "../../utils/utils";

export const getPhotosFromUser = callback => async dispatch => {
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
      await AsyncStorage.mergeItem(
        "user",
        JSON.stringify({ image: newPath })
      ).then(async res => {
        callback();
        dispatch({
          type: ActionTypes.GET_PHOTO_USER,
          payload: newPath
        });
      });
    });
  });
};

const getName = data => {
  const result = data.path.split("/");
  return result[7];
};

const deletePhotoFromPhone = async () => {
  const result = await AsyncStorage.getItem("user");
  const parse = JSON.parse(result);
  if (parse.image) {
    await RNFS.exists(parse.image).then(async res => {
      if (res) {
        await RNFS.unlink(parse.image);
      }
    });
  }
};

export const openCamera = callback => async dispatch => {
  const directory = await createFolder();
  ImagePicker.openCamera({
    width: 500,
    height: 500,
    cropping: true
  }).then(async images => {
    const name = await getName(images);
    const newPath = `file:///${directory}/${name}`;
    RNFS.moveFile(images.path, newPath).then(async () => {
      await deletePhotoFromPhone();
      await AsyncStorage.mergeItem(
        "user",
        JSON.stringify({ image: newPath })
      ).then(async res => {
        callback();
        dispatch({
          type: ActionTypes.GET_PHOTO_USER,
          payload: newPath
        });
      });
    });
  });
};

export const editName = (name, callback) => async dispatch => {
  console.log("action", name);
  await AsyncStorage.mergeItem("user", JSON.stringify({ name: name })).then(
    () => {
      callback()
      dispatch({
        type: ActionTypes.EDIT_NAME,
        payload: name
      });
    }
  );
};
