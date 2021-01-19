/* eslint-disable no-console */
/* eslint-disable no-new */
import AsyncStorage from '@react-native-community/async-storage';
import RNSF from 'react-native-fs';
import { ActionTypes } from '../constants';
import { STORAGE_KEY } from '../../utils/constans';
import { createFolder } from '../../utils/utils';
import { bitcoin, database, chatService } from '../../../App';

/**
 * in this module are the global actions of the application
 * @module AplicationAction
 */

// eslint-disable-next-line import/no-mutable-exports
export let ws;

/**
 *@function
 *@description executes when starting the application verifying that the user
  exists
 *@returns {object}
 */

export const verifyAplicationState = () => async (dispatch) => {
  let storage;
  if (!process.env.JEST_WORKER_ID) {
    storage = await AsyncStorage.getItem(STORAGE_KEY);
  } else {
    storage = 'created';
  }
  if (storage) {
    dispatch({
      type: ActionTypes.APP_STATUS,
      payload: storage
    });
  }
};

/**
 * @function
 * @description the user is added and saved in the database
 * @param {object} obj Information about the user.
 * @param {string} obj.name The name of the user.
 */

export const restoreAccountWithPin = (pin, callback) => async (dispatch) => {
  const shaPing = await bitcoin.sha256(pin);
  database.restoreWithPin(shaPing).then(async (data) => {
    bitcoin.createWallet(data.seed[0].seed);
    await chatService.startService();
    const broadcast = await AsyncStorage.getItem('broadcast');
    callback(true);
    dispatch(writeAction(data.user));
    if (broadcast) {
      dispatch({
        type: ActionTypes.ENABLE_BROADCAST
      });
    }
  }).catch((err) => {
    console.warn('in catch', err);
    callback(false);
  });
};

export const createNewAccount = (obj, callback) => async (dispatch) => {
  await createFolder();
  const shaPing = await bitcoin.sha256(obj.pin);
  const shaSeed = await bitcoin.sha256(obj.seed);
  await database.getRealm(shaPing, shaSeed);
  await database.setDataSeed(obj.seed);
  await AsyncStorage.setItem('upnp', String(true));
  const result = await bitcoin.createWallet(obj.seed);
  const peerID = await chatService.startService();
  database.writteUser({
    uid: result.pubKey,
    peerID,
    name: obj.name,
    image: null,
    contacts: [],
    chats: [
      {
        fromUID: peerID,
        toUID: 'broadcast',
        messages: []
      }
    ]
  }).then(async (res) => {
    if (!process.env.JEST_WORKER_ID) {
      await AsyncStorage.setItem('@APP:status', 'created');
    }
    dispatch(writeAction(res));
    callback();
  });
};


export const restoreWithPhrase = (pin, phrase, name) => async (dispatch) => {
  database.restoreWithPhrase(pin, phrase).then(async () => {
    await createFolder();
    const result = await bitcoin.createWallet(phrase);
    const peerID = await chatService.startService();
    await AsyncStorage.setItem('upnp', String(true));
    database.writteUser({
      uid: result.pubKey,
      peerID,
      name,
      image: null,
      contacts: [],
      chats: []
    }).then(async (res) => {
      dispatch(writeAction(res));
      if (!process.env.JEST_WORKER_ID) {
        await AsyncStorage.setItem('@APP:status', 'created');
      }
    });
  });
};

/**
 * @function
 * @description return user data to state
 * @param {object} data
 * @returns {object}
 */

const writeAction = (data) => ({
  type: ActionTypes.INITIAL_STATE,
  payload: data
});

/**
 * @function
 * @description open the application spinner
 * @returns {object}
 */
export const loading = () => (dispatch) => {
  dispatch({
    type: ActionTypes.LOADING_ON
  });
};


/**
 * @function
 * @description function to add a new pin
 * @param {Object} obj
 * @param {String} obj.path database address
 * @param {String} obj.pin  New pin
 * @param {String} obj.phrases account phrases
 */
export const newPin = (obj) => (dispatch) => {
  RNSF.unlink(obj.path).then(() => {
    database.newPin(obj.pin, obj.phrases).then(async (userData) => {
      dispatch(writeAction(JSON.parse(JSON.stringify(userData[0]))));
    });
  });
};


/**
 * set listening address of node in the state
 * @param {String} address node address
 */
export const setMultiAddress = (listenAddress) => ({
  type: ActionTypes.SET_NODE_ADDRESS,
  payload: listenAddress
});

/**
 * this will opening administrative panel in the menu drawer
 */
export const openAdministrativePanel = (callback) => async (dispatch) => {
  try {
    await AsyncStorage.setItem('admin', String(true));
    callback();
    dispatch({
      type: ActionTypes.OPENING_HIDDEN_PANEL,
      payload: true
    });
  } catch (error) {
    console.log('Error', error);
  }
};

/**
 * this will closed administrative panel in the menu drawer
 */
export const closeAdministrativePanel = (callback) => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('admin');
    callback();
    dispatch({
      type: ActionTypes.CLOSE_HIDDEN_PANEL,
      payload: false
    });
  } catch (error) {
    console.log('Error', error);
  }
};

/**
 * open the administrative panel
 */
export const isAdministrative = () => async (dispatch) => {
  let isDefined = await AsyncStorage.getItem('admin');
  // eslint-disable-next-line no-unneeded-ternary
  isDefined = isDefined ? true : false;
  dispatch({
    type: ActionTypes.OPENING_HIDDEN_PANEL,
    payload: isDefined
  });
};
