/* eslint-disable import/prefer-default-export */
import RNFetchBlob from 'rn-fetch-blob';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActionTypes } from '../constants';
import { toast } from '../../utils/utils';
import { bitcoin } from '../../../App';

/**
 *here are all the actions of sending and receiving messages
 *@module ChatAction
 */

const url = 'coap://[2001:db8::1]:5683';
const deviceInfoURL = `${url}/system/info`;
const apSettings = `${url}/wifi/ap`;
const staSettings = `${url}/wifi/sta`;
const changeCredentialsUrl = `${url}/system/credentials`;
const request = RNFetchBlob.config({
  trusty: true
});


export const getDeviceInfo = () => async (dispatch, getState) => {
  NativeModules.RNCoapClient.request(
    deviceInfoURL,
    'get'
  ).then((res) => {
    dispatch({
      type: ActionTypes.GET_DEVICE_INFO,
      payload: JSON.parse(res)
    });
  }).catch((err) => {
    dispatch(errorConnection());
  });
};

const getCredentials = async (auth) => {
  let storageCredentials;

  const value = await AsyncStorage.getItem('credentials');
  if (value) {
    try {
      const bytes = await bitcoin.decrypt(value, await bitcoin.sha256(JSON.stringify(auth)));
      const decryptedData = JSON.parse(bytes);
      storageCredentials = decryptedData;
    } catch (err) {
      storageCredentials = undefined;
    }
  } else {
    storageCredentials = {
      username: 'admin',
      password: 'admin'
    };
  }
  return storageCredentials;
};

export const changeCredentials = (credentials, callback) => async (dispatch, getState) => {
  const { username, password } = getState().device.user;
  const value = await getCredentials({ username, password });

  request.fetch('POST', changeCredentialsUrl, {
    user: value.username,
    password: value.password,
    'Content-Type': 'application/json',
  },
  JSON.stringify(credentials)).then(async (res) => {
    const { status } = res.info();
    if (status === 200) {
      const ciphertext = await bitcoin.encrypt(
        JSON.stringify(credentials),
        await bitcoin.sha256(JSON.stringify(credentials))
      ).toString();

      await AsyncStorage.setItem('credentials', ciphertext);
      dispatch({
        type: ActionTypes.CHANGE_CREDENTIAL,
        payload: credentials
      });
      callback();
    }
  });
};

const errorConnection = () => ({
  type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
  payload: 'error'
});

/**
 * function used to change the WAP settings
 * @param {Object} deviceSettings
 * @param {String | Null}  deviceSettings.ssid wap name
 * @param {String | Null}  deviceSettings.ssid wap password
 * @returns {Object}
 */
export const setApSettings = (deviceSettings) => (dispatch) => {
  request.fetch(
    'POST',
    apSettings,
    {
      'Content-Type': 'application/json',
    },
    JSON.stringify(deviceSettings)
  ).then(() => {
    toast('successful operation');
    dispatch({
      type: ActionTypes.UPDATE_DEVICE_DATA_AP,
      payload: deviceSettings
    });
  }).catch(() => {
    dispatch({
      type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
      payload: 'error'
    });
  });
};


/**
 * function used to change the STA settings
 * @param {Object} deviceSettings
 * @param {String | Null}  deviceSettings.ssid wap name
 * @param {String | Null}  deviceSettings.ssid wap password
 * @param {Null}  deviceSettings.enable
 * @returns {Object}
 */

export const setStaSettings = (deviceSettings) => (dispatch) => {
  request.fetch(
    'POST',
    staSettings,
    {
      'Content-Type': 'application/json',
    },
    JSON.stringify(deviceSettings)
  ).then(() => {
    toast('successful operation');
    dispatch({
      type: ActionTypes.UPDATE_DEVICE_DATA_STA,
      payload: deviceSettings
    });
  }).catch(() => {
    dispatch({
      type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
      payload: 'error'
    });
  });
};

/**
  * function to activate or deactivate the sta
  * @param {Object} deviceSettings
  * @param { Null}  deviceSettings.ssid sta name
  * @param {Null}  deviceSettings.ssid sta password
  * @param {Boolean}  deviceSettings.enable sta activate or desactivate
  * @returns {Object}
  */

export const activateOrDesactivate = (deviceSettings) => (dispatch) => {
  request.fetch(
    'POST',
    staSettings,
    {
      'Content-Type': 'application/json',
    },
    JSON.stringify(deviceSettings)
  ).then(() => {
    toast('successful operation');
    dispatch({
      type: ActionTypes.ACTIVE_OR_DESACTIVE_STA,
      payload: deviceSettings
    });
  }).catch(() => {
    dispatch({
      type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
      payload: 'error'
    });
  });
};


export const authDevice = (credentials) => async (dispatch) => {
  const value = await getCredentials(credentials);
  const typeUser = await AsyncStorage.getItem('credentials');
  if (value
    && value.password === credentials.password
    && value.username === credentials.username
  ) {
    dispatch({
      type: ActionTypes.AUTH_SETTING_DEVICE,
      payload: { ...credentials, typeUser: typeUser.length }
    });
  } else {
    toast('Incorrect user or password');
  }
};
