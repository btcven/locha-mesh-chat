/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line no-unused-vars
import * as ReactNative from 'react-native';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mock from 'react-native-permissions/mock';

// enzyme.configure({ adapter: new Adapter() });
jest.mock('react-native-fs', () => ({
  mkdir: jest.fn(),
  moveFile: jest.fn(() => new Promise((resolve) => {
    resolve(true);
  })),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(() => new Promise((resolve) => {
    resolve(true);
  })),
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
  readFile: jest.fn((path) => new Promise((resolve) => {
    resolve(path);
  })),
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


jest.mock('react-native-share', () => {
  // code here
});


jest.mock('@react-native-community/datetimepicker', () => {
  // code here
});

// jest.mock('@react-native-picker/picker', () => {
//   // code here
// });

jest.mock('react-native-gesture-handler', () => {
  // code here
});


jest.mock('react-navigation-stack', () => {
  // code here
});


jest.mock('react-native-permissions', () => mock);


jest.mock('@react-native-community/slider', () => {
  const data = () => null;
  return data;
});


jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(() => new Promise((resolve) => {
    resolve({
      data: 'test',
      path: 'test'
    });
  })),
  openCamera: jest.fn(() => new Promise((resolve) => {
    resolve({
      data: 'test',
      path: 'test'
    });
  })),
}));


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

jest.mock('rn-fetch-blob', () => ({
  config: jest.fn().mockReturnValue(() => {
    jest.fn().mockReturnValue(() => new Promise());
  })
}));


jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);


jest.mock('native-base/dist/src/basic/Icon', () => jest.genMockFromModule('native-base/dist/src/basic/Icon'));


jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((selector) => selector.ios),
}));

jest.mock('@react-native-community/async-storage', () => ({
  getItem: jest.fn((data) => new Promise((resolve) => {
    if (data === 'upnp') {
      resolve(true);
    } else {
      resolve(null);
    }
  })),

  setItem: jest.fn(() => new Promise((resolve) => {
    resolve(true);
  })),
  removeItem: jest.fn(() => new Promise((resolve) => {
    resolve();
  }))
}));


jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(() => new Promise((resolve) => {
    resolve({
      uri: 'test'
    });
  })),
  types: {
    allFiles: true
  }
}));


jest.mock('react-native-exception-handler', () => ({
  setJSExceptionHandler: jest.fn((callback) => callback({
    message: 'test'
  }, true)),
  setNativeExceptionHandler: jest.fn((callback) => callback('data'))
}));


jest.doMock('react-native', () =>
  // Extend ReactNative
  Object.setPrototypeOf(
    {
      // Mock a native module
      NativeModules: {
        ...ReactNative.NativeModules,
        Override: { great: 'success' },
        LocalNotification: {
          requestPermission: jest.fn(),
        },
        PlayerModule: {
          release: jest.fn(),
          getCurrentTime: jest.fn((key, callback) => callback({ seconds: 0, isPlaying: false })),
          play: jest.fn(() => new Promise((resolve) => { resolve(true); })),
          setCurrentTime: jest.fn(),
          pause: jest.fn(() => new Promise((resolve) => { resolve(true); })),
          prepare: jest.fn(() => new Promise((resolve) => {
            resolve({
              duration: 0,
              key: 'test'
            });
          })),
        },
        SoundMdoule: {
          prepareRecoder: jest.fn(() => new Promise((resolve) => { resolve('test'); })),
          startRecording: jest.fn(),
          stopRecording: jest.fn()
        },
        RNDeviceInfo: {
          VersionInfo: '1',
          getIpv6Andipv4Adress: jest.fn().mockReturnValue(['192.168.0.1']),
          scanFile: jest.fn()
        },
        ChatService: {
          start: jest.fn(() => new Promise((resolve) => {
            resolve('5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1');
          })),
          stop: jest.fn(() => new Promise((resolve) => { resolve(); })),
          dial: jest.fn(),
          sendMessage: jest.fn(),
          addNewChatService: jest.fn((xpriv, address) => new Promise((resolve) => { resolve(); })),
        },
        bitcoinModule: {
          createWallet: jest.fn(() => new Promise((resolve) => {
            resolve({
              pubKey: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
              privKey: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1'
            });
          })),
          sha256: jest.fn(() => new Promise((resolve) => { resolve('test'); })),
          getPrivateKey: jest.fn(() => new Promise((resolve) => { resolve('test'); })),
          decrypt: jest.fn(() => new Promise((resolve) => {
            resolve('{"test":"test"}');
          })),
        },
        RNPermissions: {
          ...mock
        }
      },
      PermissionsAndroid: {
        check: jest.fn(() => new Promise((resolve) => { resolve(true); })),
        request: jest.fn((param) => new Promise((resolve) => { resolve(true); })),
        PERMISSIONS: {
          RECORD_AUDIO: true,
          RESULTS: {
            GRANTED: true
          }
        },
      },
      StyleSheet: {
        create: () => ({}),
        flatten: () => ({})
      },
      Clipboard: { setString: jest.fn() },
      Platform: {
        OS: 'ios',
        select: jest.fn((selector) => selector.ios),
      }
    },
    ReactNative,
  ));
