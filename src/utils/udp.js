/* eslint-disable global-require */
import { NativeModules, NativeEventEmitter } from 'react-native';
import { messageType } from './constans';
import { getChat, setStatusMessage } from '../store/chats';
import { requestImageStatus, sentImageStatus, verifyHashImageStatus } from '../store/contacts/contactsActions';
import { notConnectedValidAp } from '../store/aplication/aplicationAction';

export default class UdpServer {
  constructor() {
    if (UdpServer.instance) {
      return UdpServer.instance;
    }

    UdpServer.instance = this;
    this.interval = null;
    this.udp = NativeModules.RBUdpServer;
    this.event = new NativeEventEmitter(this.udp);
    this.startServer();

    this.onReceive();
    this.observable();
    this.store = require('../store').default;
    this.isStarted = false;
    this.globalIpv6 = null;
    return this;
  }


  send = (message, url) => {
    this.udp.send(message, url);
  }

  startServer = () => {
    if (!process.env.JEST_WORKER_ID) {
      const { globalIpv6 } = NativeModules.RNDeviceInfo;

      if (globalIpv6) {
        this.globalIpv6 = globalIpv6;
        this.udp.initServer();
      }
    }
  }

  observable = () => {
    const device = NativeModules.RNDeviceInfo;
    this.interval = setInterval(() => {
      device.getIpv6().then((ipv6) => {
        this.store.dispatch(notConnectedValidAp(false));
        if (!this.isStarted) {
          this.globalIpv6 = ipv6;
          this.udp.initServer(ipv6);
        }
        this.isStarted = true;
      }).catch((err) => {
        this.store.dispatch(notConnectedValidAp(true));
        if (this.isStarted) {
          this.stopServer();
        }
      });
    }, 1000);
  }


  stopServer = () => {
    this.udp.stopListen();
    this.isStarted = false;
  }

  onReceive = () => {
    this.event.addListener('onMessage', ((data) => {
      const parse = JSON.parse(data);
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
  * function that is executed when the socket returns a status object
  * @param {Object} statusData
  * @param {string} statusData.toUID address where the status will be sent
  * @param {string} statusData.fromUID ui of the one that is receiving in state
  * @param {number} statusData.timestamp sent date
  * @param {string} statusData.type type status
  * @param {Object} statusData.data object that contains the status data
  */

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
}
