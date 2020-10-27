// eslint-disable-next-line import/prefer-default-export
const mockMessage1 = {
  fromUID: '0205f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd92b0be9c052a36ba5bc1d6',
  toUID: 'broadcast',
  messages: [],
  timestamp: 1580425894630,
  queue: [],
};

const mockMessage2 = {
  fromUID: '0205f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd92b0be9c052a36ba5bc1d6',
  toUID: '0202f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd91b0be9c052a30ba5bc1d9',
  messages: [],
  timestamp: 1580425894630,
  queue: [],
};

const mockContact1 = {
  name: 'test1',
  picture: null,
  uid: '02e5f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd92b0be9c052a36ba5bc1d6',
  hashUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1'
};


const mockContact2 = {
  name: 'test2',
  picture: null,
  uid: '02e5f8f594f8ca7e27d0f0b3e37432bcad4c066f4bbd91b0be9c052a36ba5bc1d6',
  hashUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1weq'
};

const mockUser = {
  uid: '02e5f8f594f8ca7e27d0f0b3e37432bcad4c066f4bbd91b0be9c052a36ba5bc1d6',
  peerID: '02e5f8f594f8ca7e27d0f0b3e37432bcad4c066f4bbd91b0be9c052a36ba5bc1d6',
  name: 'obj.name',
  image: null,
  contacts: [],
  chats: [
    {
      fromUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
      toUID: 'broadcast',
      messages: []
    }
  ]
};


const mocksetMessage = {
  fromUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  toUID: null,
  msgID: '5c28f23b375d47994b30190b01338ea18daa0b307909a2d465a597772469634e5',
  msg: {
    text: 'message'
  },
  timestamp: 12345512421242,
  type: 1
};


const mocksetMessage2 = {
  fromUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  toUID: null,
  msgID: '5c28f23b375d47994b30190b01338ea18daa0b307909a2d465a597772469634e512334123',
  msg: {
    text: 'message'
  },
  timestamp: 12345512421242,
  type: 1
};

const mocksetMessage3 = {
  fromUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  toUID: null,
  msgID: '5c28f23b375d47994b30190b01338ea18daa0b307909a2d465a5977724634123',
  msg: {
    text: 'message'
  },
  timestamp: 12345512421242,
  type: 1
};


const mocksetMessage4 = {
  fromUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  toUID: null,
  msgID: '5c28f23b375d47994b30190b01338ea18daa0b307909a2d465a59777246341231242',
  msg: {
    text: 'message x2'
  },
  timestamp: 12345512421242,
  type: 1
};

const mockContact = {
  uid: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  name: 'test',
  picture: null,
  hashUID: '0202f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd91b0be9c052a30ba5bc1d9'
};


const temporalInfo = {
  hashUID: '0202f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd91b0be9c052a30ba5bc1d923124sf124asf',
  name: 'temporal',
  timestamp: 1234251234
};


const temporalInfo2 = {
  hashUID: undefined,
  name: 'temporal',
  timestamp: 1234251234
};


const messageStatus = {
  fromUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  toUID: null,
  timestamp: 1234251234,
  data: {
    status: 'delivered',
    msgID: '5c28f23b375d47994b30190b01338ea18daa0b307909a2d465a59777246341231242'
  },
  type: 2
};


export default {
  mockContact1,
  mockContact2,
  mockMessage2,
  mockMessage1,
  mocksetMessage,
  mocksetMessage2,
  mocksetMessage3,
  mocksetMessage4,
  mockUser,
  mockContact,
  temporalInfo,
  temporalInfo2,
  messageStatus
};
