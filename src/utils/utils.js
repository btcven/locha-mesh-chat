import RNFS from 'react-native-fs';
import { ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
import { Toast } from 'native-base';
import Identicon from 'identicon.js';
import BackgroundTimer from 'react-native-background-timer';
import { database, bitcoin } from '../../App';
import {
  selectedChat,
  messageQueue,
  updateState
} from '../store/chats';
import NotifService from './notificationService';
import NavigationService from './navigationService';
import store from '../store';

/**
 * global functions used in multiple places in the app
 * @module Utils
 */

export const notification = new NotifService();
/**
 * function to request store permissions
 * @function
 * @async
 *
 */
async function requestStoragePermission() {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
}

export const pendingObservable = () => {
  BackgroundTimer.runBackgroundTimer(() => {
    database.cancelMessages().then(() => {
      store.dispatch(updateState());
    });
  }, 10000);
};

export const FileDirectory = Platform.select({
  ios: () => `${RNFS.DocumentDirectoryPath}/LochaMesh`,
  android: () => `${RNFS.ExternalStorageDirectoryPath}/LochaMesh`
})();


/**
 * this function extracts an image from memory with base64 format
 * @param path address in the image to be extracted
 * @returns {String}
 */

export const getPhotoBase64 = async (path) => {
  const photoBase64 = await RNFS.readFile(path, 'base64');
  return photoBase64;
};

/**
 *
 * function to create the application folder
 * @function
 * @async
 * @returns {Promise<string>}
 */

export const createFolder = async () => {
  if (Platform.OS === 'android') {
    await requestStoragePermission();
  }
  const pictureDirectory = `${FileDirectory}/Pictures`;
  const audioDirectory = `${FileDirectory}/Audios`;
  await RNFS.mkdir(FileDirectory.toString());
  await RNFS.mkdir(pictureDirectory.toString());
  await RNFS.mkdir(audioDirectory.toString());
};

/**
 *
 * function to redirect when clicking on the notification
 * @param {object} data
 */

export const notifyRedirect = (data) => {
  const result = getInfoMessage(Number(data.id));
  store.dispatch(selectedChat({ toUID: result.toUID }));
  const contact = {
    hashUID: result.hashUID,
    name: result.name,
    picture: result.picture,
    uid: result.uid
  };
  NavigationService.navigate('chat', contact);
};

/**
 *
 * is activated when a new message is received filters the data necessary for the notification
 * @param {object} res
 */

export const onNotification = (res) => {
  const state = store.getState();
  const view = res.fromUID;
  const rule = state.aplication.view !== view;
  unreadMessages(rule, state, view, res);
  if (state.config.peerID !== res.fromUID && rule) {

    const id = parseInt((view), 16);

    const result = getInfoMessage(id);
    const allData = { ...res, name: result.name };
    notification.localNotif(allData, id);
  }
};

export const unreadMessages = (rule, state, view, data) => {
  const index = state.chats.chat.findIndex((chat) => chat.toUID === view);

  if (rule) {
    store.dispatch(messageQueue(index, data.id, view));
  }
};

/**
 *
 * function to remove a contact or a chat from a list of selected
 * @param {array}  selected  objects already selected in the state
 * @param {object} unSelected objecto a remover del la lista de seleccionados
 * @returns {object}
 */

export const unSelect = (selected, unSelected) => {
  if (!Array.isArray(selected)) {
    throw new Error();
  }
  const result = selected.filter((itemSelected) => {
    if (selected.toUID) {
      return unSelected.toUID !== itemSelected.toUID;
    }
    return unSelected.uid !== itemSelected.uid;
  });

  return selected.length === result.length
    ? { found: false }
    : { found: true, data: result };
};

/**
 * get file information for the message at home
 * @param {String} typeFile  type of file
 * @function
 */

/**
 *
 * function used to change the background color of a selected list
 * @param {array} selected
 * @param {string} id
 * @returns {string}
 */

export const getSelectedColor = (selected, id) => {
  const result = selected.find((itemSelected) => {
    if (itemSelected.toUID) {
      return itemSelected.toUID === id;
    }
    return itemSelected.uid === id;
  });

  return result ? '#f5f5f5' : '#fff';
};

const getInfoMessage = (id) => {
  const state = store.getState();
  const result = Object.values(state.chats.chat).find((data) => {
    const sub = parseInt((data.toUID), 16);
    return sub === id;
  });
  const contact = Object.values(
    state.contacts.contacts
  ).find((itemContact) => itemContact.uid === result.toUID);

  return { toUID: result.toUID, ...contact };
};

/**
 * function used to save the image in memory
 * @param {String} base64File base64 format image
 */
export const saveImageBase64 = (base64File) => new Promise((resolve, reject) => {
  const connectiveAddress = Platform.OS === 'android' ? 'file:///' : '';
  const name = `IMG_${new Date().getTime()}`;
  const directory = `${connectiveAddress}${FileDirectory}/Pictures/${name}.jpg`.trim();
  RNFS.writeFile(directory, base64File, 'base64').then(() => {
    resolve(directory);
  }).catch(() => {
    reject();
  });
});

/**
 *
 * function to display a message on the phone works only for android
 * @param {string} message
 */
const androidToast = (message) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    1,
    ToastAndroid.BOTTOM,
    25,
    60
  );
};


const iOSToast = (message) => {
  Toast.show({
    text: message,
    style: { zIndex: 99999999999999 }
  });
};


export const toast = (message) => {
  if (Platform.OS === 'android') {
    androidToast(message);
  } else {
    iOSToast(message);
  }
};

/**
 *
 * function that generates a hexadecimal color from a string
 * @param {string} str string received to generate the color
 * @returns {string}
 */
export const hashGenerateColort = (str) => {
  try {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-bitwise
      const value = (hash >> (i * 8)) & 0xff;
      colour += (`00${value.toString(16)}`).substr(-2);
    }
    return colour;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * function to generate an icon with a hash
 * @param {string} data string received to generate the icon
 */

export const getSha256 = (data, callback) => {
  bitcoin.sha256(data).then((res) => {
    callback(res);
  });
};

export const getIcon = (data) => {
  try {
    const icon = new Identicon(data, {
      background: [255, 255, 255, 255],
      size: 100
    }).toString();

    return `data:image/png;base64,${icon}`;
  } catch (error) {
    throw new Error(error);
  }
};
