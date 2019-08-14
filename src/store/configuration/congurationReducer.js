import { ActionTypes } from "../constants";

const AplicationState = {
  id: null,
  image: null,
  name: ""
};

export const configurationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return { ...action.payload };
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
