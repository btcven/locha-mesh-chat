import 'react-native';

jest.mock('react-native-fs', () => ({
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  stopDownload: jest.fn(),
  resumeDownload: jest.fn(),
  isResumable: jest.fn(),
  stopUpload: jest.fn(),
  completeHandlerIOS: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  existsAssets: jest.fn(),
  readdir: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  read: jest.fn(),
  readFileAssets: jest.fn(),
  hash: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
  write: jest.fn(),
  downloadFile: jest.fn(),
  uploadFiles: jest.fn(),
  touch: jest.fn(),
  MainBundlePath: jest.fn(),
  CachesDirectoryPath: jest.fn(),
  DocumentDirectoryPath: jest.fn(),
  ExternalDirectoryPath: jest.fn(),
  ExternalStorageDirectoryPath: jest.fn(),
  TemporaryDirectoryPath: jest.fn(),
  LibraryDirectoryPath: jest.fn(),
  PicturesDirectoryPath: jest.fn(),
}));


jest.mock('@react-native-community/async-storage', () => {
  // code here
});


jest.mock('react-native-share', () => {
  // code here
});

jest.mock('react-native-sound', () => {
  // code here
});


jest.mock('react-native-gesture-handler', () => {
  // code here
});

jest.mock('react-navigation-stack', () => {
  // code here
});


jest.mock('@react-native-community/slider', () => {
  // code here
});


jest.mock('react-native-audio', () => {
  // code here
});

jest.mock('@react-native-community/slider', () => {
  // code here
});


jest.mock('react-navigation', () => ({
  createAppContainer: jest.fn().mockReturnValue(() => null),
  createDrawerNavigator: jest.fn(),
  createMaterialTopTabNavigator: jest.fn(),
  createStackNavigator: jest.fn(),
  StackActions: {
    push: jest.fn().mockImplementation((x) => ({ ...x, type: 'Navigation/PUSH' })),
    replace: jest.fn().mockImplementation((x) => ({ ...x, type: 'Navigation/REPLACE' })),
  },
  NavigationActions: {
    navigate: jest.fn().mockImplementation((x) => x),
  }
}));

jest.mock('react-native-background-timer', () => {
  // code here
});

jest.mock('NativeEventEmitter', () => class MockNativeEventEmitter {
  addListener = () => jest.fn()

  removeListener = () => jest.fn()

  removeAllListeners = () => jest.fn()
});


// jest.mock('LocalNotification', () => ({
//   requestPermission: jest.fn()
// }));

// jest.mock('NativeModules', () => ({
//   LocalNotification: { requestPermission: jest.fn() }
// }));

jest.mock('Platform', () => {
  const Platform = require.requireActual('Platform');
  Platform.OS = 'android';
  return Platform;
});


jest.mock('PermissionsAndroid', () => {
  const PermissionsAndroid = require.requireActual('PermissionsAndroid');

  return {
    ...PermissionsAndroid,
    request: () => jest.fn()
  };
});
