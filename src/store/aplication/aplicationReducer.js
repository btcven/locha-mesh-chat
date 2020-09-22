/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  photos: [],
  loading: false,
  tab: 1,
  menu: false,
  view: undefined,
  appStatus: undefined,
  nodeAddress: [],
  administrative: false
};

export const AplicationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return { ...state };
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

    case ActionTypes.MANUAL_CONNECTION: {
      return {
        ...state,
        retryConnection: action.payload !== undefined
          ? action.payload
          : !state.retryConnection
      };
    }
    case ActionTypes.OPENING_HIDDEN_PANEL: {
      return { ...state, administrative: action.payload };
    }
    default: {
      return state;
    }
  }
};
