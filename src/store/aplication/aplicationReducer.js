import { ActionTypes } from "../constants";

const AplicationState = {
  aplication: true,
  photos: [],
  tab: 1,
  view: undefined
};

export const AplicationReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return { ...state };
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
    default: {
      return state;
    }
  }
};
