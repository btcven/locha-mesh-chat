/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { ActionTypes } from '../constants';

const deviceInfoURL = 'http://192.168.4.1:2565/get-device-info';

export const getDeviceInfo = () => (dispatch) => {
  axios.get(deviceInfoURL).then(((res) => {
    dispatch({
      type: ActionTypes.GET_DEVICE_INFO,
      payload: res.data
    });
  }));
};
