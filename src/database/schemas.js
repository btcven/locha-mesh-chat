export const contactSchema = {
  name: 'Contact',
  primaryKey: 'uid',
  properties: {
    uid: 'string',
    name: 'string',
    picture: 'string?',
    nodeAddress: 'string',
    imageHash: 'string?',
    hashUID: 'string'
  }
};

export const fileSchema = {
  name: 'File',
  properties: {
    fileType: 'string',
    file: 'string'
  }
};

export const messageSquema = {
  name: 'Message',
  primaryKey: 'id',
  properties: {
    name: 'string?',
    id: 'string',
    fromUID: 'string',
    toUID: 'string?',
    msg: 'string',
    file: 'File?',
    timestamp: 'int',
    shippingTime: 'int',
    viewed: 'int?',
    status: 'string?',
    idHash: 'string?',
    type: 'int'
  }
};

export const broadcastContacts = {
  name: 'temporalContacts',
  primaryKey: 'hashUID',
  properties: {
    hashUID: 'string',
    name: 'string',
    timestamp: 'int'
  }
};

export const chatSquema = {
  name: 'Chat',
  primaryKey: 'toUID',
  properties: {
    fromUID: 'string',
    toUID: 'string',
    messages: { type: 'list', objectType: 'Message' },
    timestamp: 'int?',
    queue: 'string[]'
  }
};

export const userSchema = {
  name: 'user',
  primaryKey: 'uid',
  properties: {
    uid: { type: 'string', indexed: true },
    peerID: 'string?',
    name: 'string',
    picture: 'string?',
    imageHash: 'string?',
    contacts: { type: 'list', objectType: 'Contact' },
    chats: { type: 'list', objectType: 'Chat' }
  }
};


export const seed = {
  name: 'Seed',
  primaryKey: 'seed',
  properties: {
    id: 'string',
    seed: 'string',
  }
};
