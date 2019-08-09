import { ActionTypes } from "../constants";
import CameraRoll from "@react-native-community/cameraroll";
import { PermissionsAndroid } from "react-native";

export const InitialState = () => {
  return {
    type: ActionTypes.INITIAL_STATE
  };
};

export const getPhotosFromGallery = callback => async dispatch => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      CameraRoll.getPhotos({ first: 200, assetType: "Photos" }).then(
        res => {
          let photoArray = res.edges;
          dispatch({
            type: ActionTypes.GET_PHOTO,
            payload: photoArray
          });
          callback();
        }
      );
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export const changeTab = tab => {
  return {
    type: ActionTypes.CHANGE_TAB,
    payload: tab
  };
};
