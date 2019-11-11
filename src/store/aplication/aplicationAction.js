import { ActionTypes } from "../constants";
import { createFolder, backgroundTimer } from "../../utils/utils";
import {
  writteUser,
  getUserData,
  cancelUnreadMessages
} from "../../database/realmDatabase";
import Bitcoin from "../../utils/Bitcoin";
import Socket from "../../utils/socket";
import store from "../../store";

/**
 * in this module are the global actions of the application
 * @module AplicationAction
 
 */

const bitcoin = new Bitcoin();
export let ws = undefined;

/**
 *@function
 *@description executes when starting the application verifying that the user exists and if it exists initiates the connection with the socket
 *@returns {object}
 */

export const InitialState = () => async dispatch => {
  //backgroundTimer();
  getUserData().then(async res => {
    if (res.length >= 1) {
      dispatch(writeAction(JSON.parse(JSON.stringify(res[0]))));
      ws = new Socket(store);
    }
  });
};

/**
 * @function
 * @description the user is added and saved in the database
 * @param {object} obj Information about the user.
 * @param {string} obj.name The name of the user.
 */

export const setInitialUser = obj => async dispatch => {
  dispatch(loading());
  await createFolder();
  const result = await bitcoin.generateAddress();
  writteUser({
    uid: result.publicKey.toString(),
    name: obj.name,
    image: null,
    contacts: [],
    chats: [
      {
        fromUID: result.publicKey.toString(),
        toUID: "broadcast",
        messages: []
      }
    ]
  }).then(res => {
    dispatch(writeAction(res));
    ws = new Socket(store);
  });
};

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
