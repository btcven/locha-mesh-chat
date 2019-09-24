export const contactSchema = {
  name: "Contact",
  primaryKey:"uid",
  properties: {
    uid: "string",
    name: "string",
    picture: "string?",
    hashUID: "string"
  }
};

export const messageSquema = {
  name: "Message",
  primaryKey: "id",
  properties: {
    name: "string?",
    id: "string",
    fromUID: "string",
    toUID: "string?",
    msg: "string",
    timestamp: "int",
    type: "string"
  }
};

export const BroadCasContacts = {
  name: "temporalContacts",
  primaryKey: "hashUID",
  properties: {
    hashUID: "string",
    name: "string",
    timestamp: "int"
  }
};

export const chatSquema = {
  name: "Chat",
  primaryKey: "toUID",
  properties: {
    fromUID: "string",
    toUID: "string",
    messages: { type: "list", objectType: "Message" }
  }
};

export const userSchema = {
  name: "user",
  primaryKey: "uid",
  properties: {
    uid: { type: "string", indexed: true },
    name: "string",
    picture: "string?",
    contacts: { type: "list", objectType: "Contact" },
    chats: { type: "list", objectType: "Chat" }
  }
};
