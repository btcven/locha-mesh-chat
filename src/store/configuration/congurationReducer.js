import {ActionTypes} from "../constants";

const AplicationState = {
  userPhoto: null,
  name: ""
};

export const configurationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.GET_PHOTO_USER: {
      return { ...state, userPhoto: action.payload };
    }
    default: {
      return state;
    }
  }
};
