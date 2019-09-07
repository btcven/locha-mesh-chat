import RNFS from "react-native-fs";
import { ToastAndroid } from "react-native";
import { PermissionsAndroid } from "react-native";

async function requestStoragePermission() {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
  } catch (err) {
    console.warn(err);
  }
}

export const FileDirectory =
  RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";

export const createFolder = async () => {
  await requestStoragePermission();
  const directory = RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";
  await RNFS.mkdir(FileDirectory.toString()).then(res =>
    console.log("se creo")
  );
  return directory;
};

export const androidToast = message => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    1,
    ToastAndroid.BOTTOM,
    25,
    60
  );
};
