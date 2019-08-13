import RNFS from "react-native-fs";

export const createFolder = async () => {
  const directory = RNFS.ExternalStorageDirectoryPath + "/Pictures/LochaMesh/";
  await RNFS.mkdir(directory.toString());
  return directory;
};
