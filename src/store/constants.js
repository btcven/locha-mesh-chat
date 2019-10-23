export const ActionTypes = {
  //APLICATION
  INITIAL_STATE: "@@aplication/INITIAL_STATE",
  GET_PHOTO: "@@aplication/GET_PHOTO",
  ROUTE: "@@aplication/ROUTE",
  CHANGE_TAB: "@@aplication/CHANGE_TAB",
  LOADING_ON: "@@aplication/LOADING_ON",
  LOADING_OFF: "@@aplication/LOADING_OFF",
  OPEN_MENU: "@@aplication/OPEN_MENU",
  CLOSE_MENU: "@@aplication/CLOSE_MENU",

  //CONFIGURATION
  GET_PHOTO_USER: "@@configuration/GET_PHOTO",
  EDIT_NAME: "@@configuration/EDIT_NAME",

  //CONTACTS

  ADD_CONTACTS: "@@contacts/ADD_CONTACTS",
  DELETE_CONTACT: "@contacts/DELETE_CONTACT",
  EDIT_CONTACT: "@contacts/EDIT_CONTACT",

  //CHATS

  RELOAD_BROADCAST_CHAT: "@@chat/RELOAD_BROADCAST_CHAT",
  IN_VIEW: "@@chat/IN_VIEW",
  SELECTED_CHAT: "@@chat/SELETED_CHAT",
  NEW_MESSAGE: "@@chat/NEW_MESSAGE",
  DELETE_MESSAGE: "@@chat/DELETE_MESSAGE",
  DELETE_ALL_MESSAGE: "@@chat/DELETE_ALL_MESSAGE"
};
