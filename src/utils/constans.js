/* eslint-disable global-require */

export const broadcastInfo = {
  name: 'Broadcast',
  lastMessage: 'Welcome to locha mesh',
  date: new Date().getTime(),
  hashUID: '0205f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd92b0be9c052a36ba5bc1d6'
};

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
