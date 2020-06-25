/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  aplication: true,
  photos: [],
  loading: false,
  tab: 1,
  menu: false,
  view: undefined,
  appStatus: undefined,
  wsUrl: undefined,
  retryConnection: 0,
  notConnectedValidAp: null
};

export const AplicationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return { ...state };
    }

    case ActionTypes.CLEAR_ALL: {
      return { ...AplicationState, appStatus: 'created' };
    }

    case ActionTypes.APP_STATUS: {
      return { ...state, appStatus: action.payload };
    }

    case ActionTypes.IN_VIEW: {
      return { ...state, view: action.payload };
    }

    case ActionTypes.GET_PHOTO: {
      return { ...state, photos: action.payload };
    }
    case ActionTypes.CHANGE_TAB: {
      return { ...state, tab: action.payload };
    }

    case ActionTypes.LOADING_ON: {
      return { ...state, loading: true };
    }

    case ActionTypes.LOADING_OFF: {
      return { ...state, loading: false };
    }

    case ActionTypes.OPEN_MENU: {
      return { ...state, menu: true };
    }

    case ActionTypes.CLOSE_MENU: {
      return { ...state, menu: false };
    }

    case ActionTypes.URL_CONNECTION: {
      return { ...state, wsUrl: action.payload, retryConnection: 0 };
    }

    case ActionTypes.CONNECTION_ATTEMPT: {
      return { ...state, retryConnection: state.retryConnection + 1 };
    }

    case ActionTypes.MANUAL_CONNECTION: {
      return { ...state, retryConnection: 0 };
    }

    case ActionTypes.NOT_CONNECTED_VALID_AP: {
      return { ...state, notConnectedValidAp: action.payload };
    }
    default: {
      return state;
    }
  }
};
