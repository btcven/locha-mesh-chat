import { NativeModules, NativeEventEmitter } from 'react-native';
import { bitcoin } from '../../App';
import { getChat, setStatusMessage, setPeers, removeDisconnedPeers } from '../store/chats';
import { messageType } from './constans';
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
    this.onNewExternalAddress();
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
    dispatch(setStatusMessage(statusData));
  };

  onNewListenAddr = () => {
    this.event.addListener('newListenAddr', ((multiaddr) => {
      this.store.dispatch(setMultiAddress(multiaddr));
    }));
  }

  onNewExternalAddress = () => {
    this.event.addListener('externalAddress', (externalAddress) => {
      const result = this.store.getState().config.nodeAddress.find(address => {
        return address === externalAddress;
      });
      if (!result) {
        this.store.dispatch(setMultiAddress(externalAddress));
      }
    });
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
