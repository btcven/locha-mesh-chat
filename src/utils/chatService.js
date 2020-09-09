import { NativeModules, NativeEventEmitter } from 'react-native';
import { bitcoin } from '../../App';
import { getChat, setStatusMessage, setPeers, removeDisconnedPeers } from '../store/chats';
import { messageType, addressType } from './constans';
import { requestImageStatus, sentImageStatus, verifyHashImageStatus } from '../store/contacts';
import { setMultiAddress } from '../store/aplication';

export default class ChatService {
  constructor() {
    if (ChatService.instance) {
      return ChatService.instance;
    }

    this.service = NativeModules.ChatService;
    this.event = new NativeEventEmitter(this.service);
    this.onNewMessage();
    this.onNewListenAddr();
    this.onConnectionEstablished();
    this.onConnectionClosed();
    this.store = require('../store').default;
    ChatService.instance = this;

    return this;
  }

  stop = async () => {
    await this.service.stop();
  }

  dial = async (multiaddr) => {
    await this.service.dial(multiaddr);
  }

  send = (message) => {
    this.service.sendMessage(message);
  }

  onNewMessage = () => {
    this.event.addListener('newMessage', ((message) => {
      const parse = JSON.parse(message);
      const { dispatch } = this.store;
      switch (parse.type) {
        case messageType.MESSAGE: dispatch(getChat(parse));
          break;
        // Execute function that is in chat actions
        case messageType.STATUS: this.setStatus(parse);
          break;
        default:
          break;
      }
    }));
  }

  setStatus = async (statusData) => {
    const { dispatch } = this.store;
    switch (statusData.data.status) {
      // execute function that is in contact actions
      case 'RequestImage': dispatch(requestImageStatus(statusData));
        break;
      // Execute function that is in contact actions
      case 'sentImage': dispatch(sentImageStatus(statusData));
        break;
      // Execute function that is in contact actions
      case 'verifyHashImage': dispatch(verifyHashImageStatus(statusData));
        break;
      // Execute function that is in chat actions
      default: dispatch(setStatusMessage(statusData));
        break;
    }
  };

  onNewListenAddr = () => {
    this.event.addListener('newListenAddr', ((multiaddr) => {
      this.store.dispatch(setMultiAddress(multiaddr));
    }));
  }

  startService = async () => {
    const xpriv = await bitcoin.getPrivKey();
    const PeerID = await this.service.start(xpriv, true);

    return PeerID;
  }

  getPeerId = async () => this.service.getPeerId()

  getlisteningAddress = () => this.multiaddr


  onConnectionEstablished = () => {
    this.event.addListener('connectionEstablished', (({ peer, numEstablished }) => {
      this.store.dispatch(setPeers(peer));
    }));
  }

  onConnectionClosed = () => {
    this.event.addListener('connectionClosed', (({ peer, numEstablished, cause }) => {
      this.store.dispatch(removeDisconnedPeers(peer));
    }));
  }
}
