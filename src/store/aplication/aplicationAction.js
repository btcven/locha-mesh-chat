/* eslint-disable no-new */
import { AsyncStorage, NativeModules } from 'react-native';
import { sha256 } from 'js-sha256';
import RNSF from 'react-native-fs';
import { ActionTypes } from '../constants';
import { STORAGE_KEY } from '../../utils/constans';
import { createFolder } from '../../utils/utils';
import { bitcoin, database } from '../../../App';
import UdpServer from '../../utils/udp';

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
  database.restoreWithPin(sha256(pin)).then(async (res) => {
    dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
    // const url = await AsyncStorage.getItem('@APP:URL_KEY');
    new UdpServer();
    dispatch({ type: ActionTypes.URL_CONNECTION, payload: ws.url });
  }).catch(() => {
    callback();
  });
};

export const createNewAccount = (obj) => async (dispatch) => {
  await database.getRealm(sha256(obj.pin), sha256(obj.seed));
  await database.setDataSeed(obj.seed);
  await createFolder();
  // const result = await bitcoin.generateAddress(obj.seed);
  database.writteUser({
    uid: NativeModules.RNDeviceInfo.globalIpv6,
    ipv6Address: NativeModules.RNDeviceInfo.globalIpv6,
    name: obj.name,
    image: null,
    contacts: [],
    chats: []
  }).then(async (res) => {
    if (!process.env.JEST_WORKER_ID) {
      await AsyncStorage.setItem('@APP:status', 'created');
    }
    dispatch(writeAction(res));
    new UdpServer();
    dispatch({ type: ActionTypes.URL_CONNECTION, payload: ws.url });
  });
};


export const restoreWithPhrase = (pin, phrase, name) => async (dispatch) => {
  database.restoreWithPhrase(pin, phrase).then(async () => {
    await createFolder();
    // const result = await bitcoin.generateAddress(phrase);
    const ivp6 = !process.env.JEST_WORKER_ID ? '::1'
      : NativeModules.RNDeviceInfo.globalIpv6;
    database.writteUser({
      uid: ivp6,
      ipv6Address: ivp6,
      name,
      image: null,
      contacts: [],
      chats: []
    }).then(async (res) => {
      dispatch(writeAction(res));
      if (!process.env.JEST_WORKER_ID) {
        await AsyncStorage.setItem('@APP:status', 'created');
      }
      new UdpServer();
      dispatch({ type: ActionTypes.URL_CONNECTION, payload: ws.url });
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
 * @description hide application spinner
 */

export const loaded = () => ({
  type: ActionTypes.LOADING_OFF
});

export const clearAll = () => (dispatch) => {
  dispatch({
    type: ActionTypes.CLEAR_ALL
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
