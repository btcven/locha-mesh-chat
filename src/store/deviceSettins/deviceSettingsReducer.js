/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  voltaje: '',
  avg_current: '',
  temp: '',
  avg_power: '',
  free_memory: '',
  ap: {
    ssid: ''
  },
  sta: {
    ssid: '',
    enabled: false
  },
  status: 'waiting'
};

export const deviceInfoReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.GET_DEVICE_INFO: {
      return { status: 'connected', ...action.payload };
    }
    case ActionTypes.SET_DEVICE_CONNECTION_STATUS: {
      return { ...state, status: action.payload };
    }
    default: {
      return state;
    }
  }
};
