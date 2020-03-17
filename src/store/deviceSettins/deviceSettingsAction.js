/* eslint-disable import/prefer-default-export */
import RNFetchBlob from 'react-native-fetch-blob';
import { ActionTypes } from '../constants';
import { toast } from '../../utils/utils';


/**
 *here are all the actions of sending and receiving messages
 *@module ChatAction
 */

const url = 'https://192.168.4.1:2656';
const deviceInfoURL = `${url}/system/info`;
const apSettings = `${url}/wifi/ap`;
const staSettings = `${url}/wifi/sta`;

const request = RNFetchBlob.config({
  trusty: true
});


/**
 * function used to read the characteristics of esp32
 * @returns {Object}
 */
export const getDeviceInfo = () => async (dispatch) => {
  request.fetch('GET', deviceInfoURL).then((res) => {
    dispatch({
      type: ActionTypes.GET_DEVICE_INFO,
      payload: JSON.parse(res.data)
    });
  }).catch(() => {
    dispatch({
      type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
      payload: 'error'
    });
  });
};


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
