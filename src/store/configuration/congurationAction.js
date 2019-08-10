import { PermissionsAndroid } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import { ActionTypes } from "../constants";

export const getPhotosFromUser = callback => async dispatch => {
  const directory = RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh";
  RNFS.mkdir(directory.toString()).then(console.log(directory));
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.openPicker({
        cropping: true,
        width: 500,
        height: 500
      }).then(async images => {
        console.log(images)
        RNFS.moveFile(images.path, 'file:///storage/emulated/0/Pictures/LochaMesh/00f15211-32e0-4c68-be51-a3d1bc031ed2.jpg');
        // dispatch({
        //   type: ActionTypes.GET_PHOTO_USER,
        //   payload: images
        // });
      });
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.log(err);
  }
};
