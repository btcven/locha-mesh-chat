import RNFS from 'react-native-fs';
import { ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
import { Toast } from 'native-base';
import Identicon from 'identicon.js';
import { database, bitcoin } from '../../App';
import {
  messageQueue,
} from '../store/chats';
import NotifService from './notificationService';
import NavigationService from './navigationService';
import store from '../store';
import ChatService from './chatService';
import { broadcastInfo } from './constans';

/**
 * global functions used in multiple places in the app
 * @module Utils
 */

export const getChatserviceInstance = () => new ChatService();

export const getStore = () => ({ dispatch: store.dispatch, getState: store.getState });


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
  await RNFS.mkdir(`file://${FileDirectory.toString()}`);
  await RNFS.mkdir(`file://${pictureDirectory.toString()}`);
  await RNFS.mkdir(`file://${audioDirectory.toString()}`);
};

/**
 *
 * function to redirect when clicking on the notification
 * @param {object} data
 */

export const notifyRedirect = (data) => {
  const result = getInfoMessage(Number(data.id));
  NavigationService.navigate('chat', {
    contacts: {
      ...result.contact,
    },
    chatUID: result.toUID,
    hashUID: result.contact.hashUID,
    name: result.contact.name
  });
};

/**
 *
 * is activated when a new message is received filters the data necessary for the notification
 * @param {object} res
 */
export const onNotification = (res) => {
  const state = store.getState();
  const view = res.toUID === 'broadcast' ? res.toUID : res.fromUID;
  const rule = state.aplication.view !== view;
  unreadMessages(rule, state.chats, view, res);
  if (state.config.peerID !== res.fromUID && rule) {
    const id = parseInt((view), 16);

    const result = getInfoMessage(id);
    const allData = { ...res, name: result.name };
    notification.localNotif(allData, id);
  }
};

export const unreadMessages = (rule, state, view, data) => {
  const index = state.chat.findIndex((chat) => chat.toUID === view);
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
  let contact;
  if (result.toUID !== 'broadcast') {
    contact = state.contacts.contacts.find((itemContact) => itemContact.uid === result.toUID);
  } else {
    contact = {
      ...broadcastInfo,
      file: null
    };
  }

  // console.warn(contact);
  return { toUID: result.toUID, contact };
};

/**
 *
 * function to display a message on the phone works only for android
 * @param {string} message
 */
const androidToast = (message) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    60
  );
};


const iOSToast = (message) => {
  if (process.env.JEST_WORKER_ID) return;
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
  const icon = new Identicon(data, {
    background: [255, 255, 255, 255],
    size: 100
  }).toString();

  return `data:image/png;base64,${icon}`;
};
