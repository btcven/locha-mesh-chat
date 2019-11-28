import { ActionTypes } from "../constants";
import { STORAGE_KEY } from '../../utils/constans'
import { createFolder, backgroundTimer } from "../../utils/utils";
import { AsyncStorage } from 'react-native'
import { bitcoin, database } from "../../../App";
import Socket from "../../utils/socket";
import store from "../../store";
import { sha256 } from "js-sha256";



/**
 * in this module are the global actions of the application
 * @module AplicationAction

 */

export let ws = undefined;

/**
 *@function
 *@description executes when starting the application verifying that the user exists and if it exists initiates the connection with the socket
 *@returns {object}
 */

export const verifyAplicationState = () => async dispatch => {
  const storage = await AsyncStorage.getItem(STORAGE_KEY)
  if (storage) {
    dispatch({
      type: ActionTypes.APP_STATUS,
      payload: storage
    })
  }

};

/**
 * @function
 * @description the user is added and saved in the database
 * @param {object} obj Information about the user.
 * @param {string} obj.name The name of the user.
 */

export const setInitialUser = obj => async dispatch => {
  // dispatch(loading());
  // await createFolder();
  const result = await bitcoin.generateAddress();
  // writteUser({
  //   uid: result.publicKey.toString(),
  //   name: obj.name,
  //   image: null,
  //   contacts: [],
  //   chats: [
  //     {
  //       fromUID: result.publicKey.toString(),
  //       toUID: "broadcast",
  //       messages: []
  //     }
  //   ]
  // }).then(res => {
  //   dispatch(writeAction(res));
  //   ws = new Socket(store);
  // });


};


export const restoreAccountWithPin = (pin) => dispatch => {
  database.restoreWithPin(sha256(pin)).then(res => {
    dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
  })
}

export const createNewAccount = (obj) => async dispatch => {
  await database.getRealm(sha256(obj.pin), sha256(obj.seed))
  await database.setDataSeed(obj.seed);
  await createFolder()
  const result = await bitcoin.generateAddress(obj.seed);
  database.writteUser({
    uid: result.publicKey.toString(),
    name: 'kevin',
    image: null,
    contacts: [],
    chats: [
      {
        fromUID: result.publicKey.toString(),
        toUID: "broadcast",
        messages: []
      }
    ]
  }).then(async res => {
    dispatch(writeAction(res));
    const STORAGE_KEY = "@APP:status";
    await AsyncStorage.setItem(STORAGE_KEY, 'created')
    ws = new Socket(store, database);
  });
}

/**
 * @function
 * @description return user data to state
 * @param {object} data
 * @returns {object}
 */

const writeAction = data => {
  return {
    type: ActionTypes.INITIAL_STATE,
    payload: data
  };
};

/**
 * @function
 * @description function to change menu tabs
 * @param {number} tab - tab id
 * @returns {object}
 */

export const changeTab = tab => {
  return {
    type: ActionTypes.CHANGE_TAB,
    payload: tab
  };
};

/**
 * @function
 * @description open the application spinner
 * @returns {object}
 */

export const loading = () => {
  return {
    type: ActionTypes.LOADING_ON
  };
};

/**
 * @function
 * @description hide application spinner
 */

export const loaded = () => {
  return {
    type: ActionTypes.LOADING_OFF
  };
};

/**
 * @function
 * @description open the connection to the socket again
 */

export const reestarConnection = () => {
  ws = new Socket(store);
};

