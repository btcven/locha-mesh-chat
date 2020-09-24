import { NativeModules, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { bitcoin } from '../../App';
import {
  getChat, setStatusMessage, setPeers, removeDisconnedPeers
} from '../store/chats';
import { messageType } from './constans';
import { setMultiAddress } from '../store/aplication';
import { cleanNodeAddress } from '../store/configuration';

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

  /**
   * this function stopping the chat service
   */
  stop = async () => {
    await this.service.stop();
  }

  /**
   * this function is used to add a new node address where it will connect to the p2p network
   * @param {String} multiaddr node address
   */
  dial = async (multiaddr) => {
    await this.service.dial(multiaddr);
  }

  /**
   * function for send a new message
   * @param {Object} message message data
   */
  send = (message) => {
    this.service.sendMessage(message);
  }

  /**
   * functions executed when is received a new message
   */
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

  /**
   * function is executed when there is a message
   * and it a message of type status
   * @param {Object} statusData;
   */
  setStatus = async (statusData) => {
    const { dispatch } = this.store;
    dispatch(setStatusMessage(statusData));
  };

  /**
   * it function is listen when the chat service sent a new address
   */
  onNewListenAddr = () => {
    this.event.addListener('newListenAddr', ((multiaddr) => {
      this.store.dispatch(setMultiAddress(multiaddr));
    }));
  }

  /**
   * function listens when there is a new public ip and loads it to the state
   */
  onNewExternalAddress = () => {
    this.event.addListener('externalAddress', (externalAddress) => {
      const result = this.store.getState().config.nodeAddress.find((address) => address === externalAddress);
      if (!result) {
        this.store.dispatch(setMultiAddress(externalAddress));
      }
    });
  }

  /**
   *  esta función inicia el servicio de chat
   *  @return PeerID
   */
  startService = async () => {
    const xpriv = await bitcoin.getPrivKey();
    // get node address  if it defined
    const addressListen = await AsyncStorage.getItem('AddressListen');
    const peerID = await this.service.start(xpriv, true, addressListen);

    return peerID;
  }

  /**
   * get peer id of the chat service
   */
  getPeerId = async () => this.service.getPeerId()

  getlisteningAddress = () => this.multiaddr


  /**
   * this is an event, it will executed when is established a new connection
   */
  onConnectionEstablished = () => {
    this.event.addListener('connectionEstablished', (({ peer, numEstablished }) => {
      this.store.dispatch(setPeers(peer));
    }));
  }

  /**
   * this is an event, its function is to detect when someone disconnects
   */
  onConnectionClosed = () => {
    this.event.addListener('connectionClosed', (({ peer, numEstablished, cause }) => {
      this.store.dispatch(removeDisconnedPeers(peer));
    }));
  }

  /**
   * this function add a new listening direction of the chat service
   * it is executed only in the  administrative pannel
   * @param {*} address  listening direction
   * @param {*} callback  callback
   */
  addNewAddressListen = async (address, callback) => {

    if (!process.env.JEST_WORKER_ID) {
      const xpriv = await bitcoin.getPrivKey();
      this.store.dispatch(cleanNodeAddress());
      this.service.addNewChatService(xpriv, address).then(() => {
        callback(null);
      }).catch((err) => {
        callback(err);
      });
    } else {
      callback(null);
    }
  }
}
