import { AsyncStorage } from 'react-native';
import { sha256 } from 'js-sha256';
import RNSF from 'react-native-fs';
import { ActionTypes } from '../constants';
import { STORAGE_KEY } from '../../utils/constans';
import { createFolder } from '../../utils/utils';
import { bitcoin, database } from '../../../App';
import Socket from '../../utils/socket';
import store from '..';

/**
 * in this module are the global actions of the application
 * @module AplicationAction

 */

// eslint-disable-next-line import/no-mutable-exports
export let ws;

/**
 *@function
 *@description executes when starting the application verifying that the user
  exists and if it exists initiates the connection with the socket
 *@returns {object}
 */

export const verifyAplicationState = () => async (dispatch) => {
  const storage = await AsyncStorage.getItem(STORAGE_KEY);
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

export const restoreAccountWithPin = (pin, callback) => (dispatch) => {
  database.restoreWithPin(sha256(pin)).then(async (res) => {
    dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
    const url = await AsyncStorage.getItem('@APP:URL_KEY');
    ws = new Socket(store, database, url);
    dispatch({ type: ActionTypes.URL_CONNECTION, payload: ws.url });
  }).catch(() => {
    callback();
  });
};

export const createNewAccount = (obj) => async (dispatch) => {
  await database.getRealm(sha256(obj.pin), sha256(obj.seed));
  await database.setDataSeed(obj.seed);
  await createFolder();
  const result = await bitcoin.generateAddress(obj.seed);
  database.writteUser({
    uid: result.publicKey.toString(),
    name: obj.name,
    image: null,
    contacts: [],
    chats: [
      {
        fromUID: result.publicKey.toString(),
        toUID: 'broadcast',
        messages: []
      }
    ]
  }).then(async (res) => {
    await AsyncStorage.setItem('@APP:status', 'created');
    dispatch(writeAction(res));
    ws = new Socket(store, database);
    dispatch({ type: ActionTypes.URL_CONNECTION, payload: ws.url });
  });
};


export const restoreWithPhrase = (pin, phrase, name) => (dispatch) => {
  database.restoreWithPhrase(pin, phrase).then(async () => {
    await createFolder();
    const result = await bitcoin.generateAddress(phrase);
    database.writteUser({
      uid: result.publicKey.toString(),
      name,
      image: null,
      contacts: [],
      chats: [
        {
          fromUID: result.publicKey.toString(),
          toUID: 'broadcast',
          messages: []
        }
      ]
    }).then(async (res) => {
      dispatch(writeAction(res));
      await AsyncStorage.setItem('@APP:status', 'created');
      ws = new Socket(store, database);
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
 * @description function to change menu tabs
 * @param {number} tab - tab id
 * @returns {object}
 */

export const changeTab = (tab) => ({
  type: ActionTypes.CHANGE_TAB,
  payload: tab
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

/**
 * @function
 * @description open the connection to the socket again
 */

export const reestarConnection = async ({ dispatch, getState }) => {
  const applicationState = getState().aplication;
  const url = await AsyncStorage.getItem('@APP:URL_KEY');
  if (applicationState.retryConnection < 3) {
    ws = new Socket(store, database, url);
  } else {
    dispatch(loaded);
  }
  dispatch({
    type: ActionTypes.CONNECTION_ATTEMPT,
  });
};

export const clearAll = () => (dispatch) => {
  dispatch({
    type: ActionTypes.CLEAR_ALL
  });
};

/**
 * @function
 * @description restore account with a file
 * @param {String}  pin file unlock pin
 * @param {obj} data database data
 * @return {obj}
 */

export const restoreWithFile = (pin, data) => (dispatch) => {
  dispatch(loading());
  database.restoreWithFile(pin, data).then(async () => {
    await AsyncStorage.setItem('@APP:status', 'created');
    await createFolder();
    ws = new Socket(store, database);
    dispatch({
      type: ActionTypes.INITIAL_STATE,
      payload: data.user
    });
  });
};

/**
 * @function
 * @description change socket connection address
 * @param {String}  url  connection url
 */

export const changeNetworkEndPoint = (url) => async () => {
  await AsyncStorage.setItem('@APP:URL_KEY', url);
  ws.socket.close();
};

/**
 * @function
 * @description function to reconnect manually
 */
export const manualConnection = () => async (dispatch) => {
  dispatch({ type: ActionTypes.MANUAL_CONNECTION });
  const url = await AsyncStorage.getItem('@APP:URL_KEY');
  ws = new Socket(store, database, url);
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
      const url = await AsyncStorage.getItem('@APP:URL_KEY');
      ws = new Socket(store, database, url);
      dispatch({ type: ActionTypes.URL_CONNECTION, payload: ws.url });
    });
  });
};
