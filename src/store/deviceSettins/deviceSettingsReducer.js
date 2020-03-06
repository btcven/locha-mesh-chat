/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  voltaje: '',
  avg_current: '',
  temp: '',
  avg_power: '',
  free_memory: ''
};

export const deviceInfoReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.GET_DEVICE_INFO: {
      return { ...action.payload };
    }
    default: {
      return state;
    }
  }
};
