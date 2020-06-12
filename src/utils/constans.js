/* eslint-disable global-require */

export const chats = [{
  idChat: '1',
  name: 'broadcast',
  lastMessage: 'welcome to locha mesh',
  picture: require('./img/fotoperfil.jpg'),
  date: new Date()
}
];

export const STORAGE_KEY = '@APP:status';

export const images = {
  noPhoto: { url: require('./img/fotoperfil.jpg') },
  file: { url: require('./img/archivo.jpg') },
  camera: { url: require('./img/camara.jpg') },
  logo: { url: require('./img/logo.png') },
  logo2: { url: require('./img/logo2.png') }
};

export const songs = {
  song1: { url: require('../songs/clicking.mp3') },
  song2: { url: require('../songs/case-closed.mp3') },
  song3: { url: require('../songs/guess-what.mp3') },
  song4: { url: require('../songs/scissors.mp3') }
};

export const IntialUser = {
  id: undefined,
  name: undefined,
  image: null,
  contacts: []
};


export const messageType = {
  HANDSHAKE: 0,
  MESSAGE: 1,
  STATUS: 2,
  ACTION: 3
};
