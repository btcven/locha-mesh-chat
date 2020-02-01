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
  hashUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1'
};

const mockUser = {
  uid: '02e5f8f594f8ca7e27d0f0b3e37432bcad4c066f4bbd91b0be9c052a36ba5bc1d6',
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


export default {
  mockContact1,
  mockContact2,
  mockMessage2,
  mockMessage1,
  mockUser
};
