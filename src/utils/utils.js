import RNFS from "react-native-fs";
import { ToastAndroid } from "react-native";

export const FileDirectory =
  RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";

export const createFolder = async () => {
  const directory = RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";
  await RNFS.mkdir(FileDirectory.toString());
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
