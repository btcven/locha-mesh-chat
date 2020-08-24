/* eslint-disable global-require */
import { NativeModules, NativeEventEmitter } from 'react-native';
import { messageType } from './constans';
import { getChat, setStatusMessage } from '../store/chats';
import { requestImageStatus, sentImageStatus, verifyHashImageStatus } from '../store/contacts/contactsActions';
import { notConnectedValidAp } from '../store/aplication/aplicationAction';
import { setNewIpv6 } from '../store/configuration/congurationAction';

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

  /**
   * function used to send messages
   *
   * @param {object} message message to send
   * @param {string} url address where the message will be sent
   */
  send = (message, url) => {
    this.udp.send(message, url);
  }

  /**
   * start server
   */
  startServer = () => {
    if (!process.env.JEST_WORKER_ID) {
      const { globalIpv6 } = NativeModules.RNDeviceInfo;

      if (globalIpv6) {
        this.globalIpv6 = globalIpv6;
        this.udp.initServer();
      }
    }
  }

  /**
  *  its function is to observe the changes in the network
  *  and verify that it is connected to a valid network
  */
  observable = () => {
    if (process.env.JEST_WORKER_ID) {
      return;
    }

    const device = NativeModules.RNDeviceInfo;
    this.interval = setInterval(() => {
      device.getIpv6().then((ipv6) => {
        this.store.dispatch(notConnectedValidAp(false));
        if (!this.isStarted) {
          this.globalIpv6 = ipv6;
          this.udp.initServer(ipv6);
        }
        this.store.dispatch(setNewIpv6(ipv6));
        this.isStarted = true;
      }).catch(() => {
        this.store.dispatch(notConnectedValidAp(true));
        if (this.isStarted) {
          this.stopServer();
        }
      });
    }, 1000);
  }

  /**
   * function used for stop server udp
   */
  stopServer = () => {
    this.udp.stopListen();
    this.isStarted = false;
  }

