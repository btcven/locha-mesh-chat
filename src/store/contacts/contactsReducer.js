/* eslint-disable import/prefer-default-export */
import { ActionTypes } from '../constants';

const AplicationState = {
  contacts: []
};

export const contactsReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ALL: {
      return { ...AplicationState };
    }

    case ActionTypes.INITIAL_STATE: {
      return {
        contacts: action.payload.contacts
      };
    }
    case ActionTypes.ADD_CONTACTS: {
      return { ...state, contacts: action.payload };
    }

    case ActionTypes.DELETE_CONTACT: {
      const result = state.contacts.filter((data) => {
        const payload = action.payload.find((contact) => contact.uid === data.uid);
        return !payload;
      });

      return { ...state, contacts: result.slice() };
    }

    case ActionTypes.EDIT_CONTACT: {
      const contacts = Object.values(state.contacts);
      const result = contacts.findIndex((data) => data.uid === action.payload.uid);

      contacts[result] = action.payload;

      return { ...state, contacts: contacts.slice() };
    }
    default: {
      return state;
    }
  }
};
