/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  uid: null,
  image: null,
  name: '',
  imageHash: null,
  ipv6Address: null,
  nodeAddress: []
};

export const configurationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return {
        ...state, ...action.payload
      };
    }
    case ActionTypes.SET_NODE_ADDRESS: {
      return {
        ...state, nodeAddress: state.nodeAddress.concat(action.payload)
      };
    }
    case ActionTypes.CLEAR_ALL: {
      return { ...AplicationState };
    }
    case ActionTypes.SET_NEW_IPV6: {
      return {
        ...state,
        ipv6Address: action.payload
      };
    }
    case ActionTypes.GET_PHOTO_USER: {
      return { ...state, picture: action.payload, imageHash: action.imageHash };
    }
    case ActionTypes.EDIT_NAME: {
      return { ...state, name: action.payload };
    }

    case ActionTypes.CLEAN_ADDRESS_LISTEN: {
      return { ...state, nodeAddress: [] };
    }
    default: {
      return state;
    }
  }
};
