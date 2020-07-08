/* eslint-disable no-fallthrough */
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
  status: 'waiting',
  user: {
    username: null,
    password: null,
    typeUser: null
  }
};

export const deviceInfoReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.GET_DEVICE_INFO: {
      return { ...state, status: 'connected', ...action.payload };
    }
    case ActionTypes.SET_DEVICE_CONNECTION_STATUS: {
      return { ...state, status: action.payload };
    }

    case ActionTypes.UPDATE_DEVICE_DATA_AP: {
      if (action.payload.ssid) {
        return {
          ...state,
          ap: {
            ssid: action.payload.ssid
          }
        };
      }
      return { ...state };
    }

    case ActionTypes.UPDATE_DEVICE_DATA_STA: {
      if (action.payload.ssid) {
        return {
          ...state,
          sta: {
            ...state.sta,
            ssid: action.payload.ssid
          }
        };
      } if (action.payload.password) {
        return {
          ...state,
          sta: {
            ...state.sta,
            ssid: action.payload.password
          }
        };
      }
    }

    case ActionTypes.ACTIVE_OR_DESACTIVE_STA: {
      return {
        ...state,
        sta: {
          ...state.sta,
          enabled: action.payload.enable
        }
      };
    }
    case ActionTypes.AUTH_SETTING_DEVICE: {
      return {
        ...state,
        status: 'waiting',
        user: {
          ...action.payload
        }
      };
    }
    case ActionTypes.CHANGE_CREDENTIAL: {
      return {
        ...state,
        user: {
          ...action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
};
