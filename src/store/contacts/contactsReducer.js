import { ActionTypes } from "../constants";

const AplicationState = {
  contacts: []
};

export const contactsReducer = (state = AplicationState, action) => {
  switch (action.type) {
    case ActionTypes.INITIAL_STATE: {
      return {
        contacts: action.payload.contacts
      };
    }
    case ActionTypes.ADD_CONTACTS: {
      return { ...state, contacts: action.payload };
    }

    case ActionTypes.DELETE_CONTACT: {
      const contacts = Object.values(state.contacts);
      console.log("acaa", " dioss");
      let result = contacts.filter(data => {
        const payload = action.payload.find(contact => {
          return contact.uid === data.uid;
        });

        return !payload;
      });

      return { contacts: result };
    }

    case ActionTypes.EDIT_CONTACT: {
      const contacts = Object.values(state.contacts);
      let result = contacts.findIndex(data => {
        return data.uid === action.payload.uid;
      });

      contacts[result] = action.payload;

      return { ...state, contacts: contacts.slice() };
    }
    default: {
      return state;
    }
  }
};
