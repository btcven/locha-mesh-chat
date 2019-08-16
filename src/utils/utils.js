import RNFS from "react-native-fs";

export const FileDirectory = RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";

export const createFolder = async () => {
  const directory = RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";
  await RNFS.mkdir(FileDirectory.toString());
  return directory;
};
