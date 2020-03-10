/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { ActionTypes } from '../constants';

const url = `http://192.168.4.1:2656`
const deviceInfoURL = `${url}/system/info`;
const apSettings = `${url}/wifi/ap`;

export const getDeviceInfo = () => (dispatch) => {
  axios.get(deviceInfoURL).then(((res) => {
    dispatch({
      type: ActionTypes.GET_DEVICE_INFO,
      payload: res.data
    });
  })).catch(() => {
    dispatch({
      type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
      payload: 'error'
    });
  });
};


export const setApSettings = (deviceSettings) => (dispatch) => {
  axios.post(apSettings, {
    ...deviceSettings
  }).then((res) => {
    console.warn(res.data);
  }).catch(() => {
    dispatch({
      type: ActionTypes.SET_DEVICE_CONNECTION_STATUS,
      payload: 'error'
    });
  });
};
