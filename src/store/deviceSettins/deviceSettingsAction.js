/* eslint-disable import/prefer-default-export */
import RNFetchBlob from 'rn-fetch-blob';
import { AsyncStorage } from 'react-native';
import { Toast } from 'native-base';
import { ActionTypes } from '../constants';
import { toast } from '../../utils/utils';

/**
 *here are all the actions of sending and receiving messages
 *@module ChatAction
 */

const url = 'https://192.168.4.1:443';
const deviceInfoURL = `${url}/system/info`;
const apSettings = `${url}/wifi/ap`;
const staSettings = `${url}/wifi/sta`;
const changeCredentialsUrl = `${url}/system/credentials`;
const request = RNFetchBlob.config({
  trusty: true
});


/**
 * function used to read the characteristics of esp32
 * @returns {Object}
 */
export const getDeviceInfo = () => async (dispatch, getState) => {
  const value = await getCredentials();
  request.fetch('GET', deviceInfoURL, {
    user: value.username,
    password: value.password,
  }).then((res) => {
    const { status } = res.info();
    if (status === 200) {
      dispatch({
        type: ActionTypes.GET_DEVICE_INFO,
        payload: JSON.parse(res.data)
      });
    } else {
      dispatch(errorConnection());
    }
  }).catch(() => {
    dispatch(errorConnection());
  });
};

const getCredentials = async () => {
  let storageCredentials;
  const value = await AsyncStorage.getItem('credentials');
  if (value) {
    storageCredentials = JSON.parse(value);
  } else {
    storageCredentials = {
      username: 'admin',
      password: 'admin'
    };
  }
  return storageCredentials;
};

export const changeCredentials = (credentials, callback) => async (dispatch) => {
  const value = await getCredentials();
  request.fetch('POST', changeCredentialsUrl, {
    user: value.username,
    password: value.password,
    'Content-Type': 'application/json',
  },
  JSON.stringify(credentials)).then(async (res) => {
    const { status } = res.info();
    if (status === 200) {
      await AsyncStorage.setItem('credentials', JSON.stringify(credentials));
      callback();
    }
  }).catch(() => {
    callback();
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
  const value = await getCredentials();
  const typeUser = await AsyncStorage.getItem('credentials');
  if (
    value.password === credentials.password
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
