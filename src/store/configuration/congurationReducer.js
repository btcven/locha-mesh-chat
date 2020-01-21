/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  uid: null,
  image: null,
  name: ''
};

export const configurationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return {
        uid: action.payload.uid,
        name: action.payload.name,
        image: action.payload.picture
      };
    }

    case ActionTypes.CLEAR_ALL: {
      return { ...AplicationState };
    }
    case ActionTypes.GET_PHOTO_USER: {
      return { ...state, image: action.payload };
    }
    case ActionTypes.EDIT_NAME: {
      return { ...state, name: action.payload };
    }
    default: {
      return state;
    }
  }
};
