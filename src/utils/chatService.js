import { NativeModules, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { bitcoin, database } from '../../App';
import {
  getChat, setStatusMessage, setPeers, removeDisconnedPeers
} from '../store/chats';
import { messageType } from './constans';
import { setMultiAddress } from '../store/aplication';
import { cleanNodeAddress } from '../store/configuration';
import { getStore } from './utils';

export default class ChatService {
  constructor() {
    if (ChatService.instance) {
      return ChatService.instance;
    }
    this.connected = true;
    this.service = NativeModules.ChatService;
    this.event = new NativeEventEmitter(this.service);
    this.onNewMessage();
    this.onNewListenAddr();
    this.onConnectionEstablished();
    this.onConnectionClosed();
    this.onNewExternalAddress();
    this.isConnected();
    this.connectionChanged();
    this.IsActiveUpnp = false;
    this.mobile = false;
    this.wifi = false;
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

  onMessage = async (message) => {
    const { dispatch, getState } = getStore();
    const parse = JSON.parse(message);

    if (parse.toUID !== 'broadcast') {
      await database.verifyValidMessage(parse.fromUID);
      // Verify that the message is for me
      if (parse.toUID !== getState().config.peerID) {
        return;
      }
    }

    switch (parse.type) {
      case messageType.MESSAGE: dispatch(getChat(parse));
        break;
      // Execute function that is in chat actions
      case messageType.STATUS: this.setStatus(parse);
        break;
      default:
        break;
    }
  }

  /**
   * functions executed when is received a new message
   */
  onNewMessage = () => {
    this.event.addListener('newMessage', (async (message) => {
      this.onMessage(message);
    }));
  }


  isConnected = () => {
    this.event.addListener('isConnect', (res) => {
      if (!res) {
        this.connected = res;
        this.stop();
      }
    });
  }

  connectionChanged = () => {
    this.event.addListener('ConnectionChanged', (res) => {
      if (res) {
        this.stop().then(() => {
          this.startService();
        });
      } else {
        this.stop();
      }
    });
  }

  /**
   * function is executed when there is a message
   * and it a message of type status
   * @param {Object} statusData;
   */
  setStatus = async (statusData) => {
    const { dispatch } = getStore();
    dispatch(setStatusMessage(statusData));
  };

  /**
   * it function is listen when the chat service sent a new address
   */
  onNewListenAddr = () => {
    this.event.addListener('newListenAddr', ((multiaddr) => {
      getStore().dispatch(setMultiAddress(multiaddr));
    }));
  }

  /**
   * function listens when there is a new public ip and loads it to the state
   */
  onNewExternalAddress = () => {
    this.event.addListener('externalAddress', (externalAddress) => {
      const result = getStore().getState().config.nodeAddress.find((address) => address === externalAddress);
      if (!result) {
        getStore().dispatch(setMultiAddress(externalAddress));
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
    this.IsActiveUpnp = !!await AsyncStorage.getItem('upnp');
    const peerID = await this.service.start(xpriv, this.IsActiveUpnp, addressListen);
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
      getStore().dispatch(setPeers(peer));
    }));
  }

  /**
   * this is an event, its function is to detect when someone disconnects
   */
  onConnectionClosed = () => {
    this.event.addListener('connectionClosed', (({ peer, numEstablished, cause }) => {
      getStore().dispatch(removeDisconnedPeers(peer));
    }));
  }

  /**
   * this function add a new listening direction of the chat service
   * it is executed only in the  administrative pannel
   * @param {*} address  listening direction
   * @param {*} callback  callback
   */
  addNewAddressListen = async (address, callback) => {
    const xpriv = await bitcoin.getPrivKey();
    getStore().dispatch(cleanNodeAddress());
    this.service.addNewChatService(xpriv, address).then(() => {
      callback(null);
    }).catch((err) => {
      callback(err);
    });
  }

  deactivateUpnp = async () => {
    const xpriv = await bitcoin.getPrivKey();
    await this.stop();
    const addressListen = await AsyncStorage.getItem('AddressListen');
    const peerID = await this.service.start(xpriv, false, addressListen);
    this.IsActiveUpnp = false;
    return peerID;
  }

  activateUpnp = async () => {
    await this.stop();
    const peerID = await this.startService();
    return peerID;
  }
}
