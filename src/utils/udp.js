import { NativeModules, NativeEventEmitter } from 'react-native';
import { messageType } from './constans';
import { getChat, setStatusMessage } from '../store/chats';
import { requestImageStatus, sentImageStatus, verifyHashImageStatus } from '../store/contacts/contactsActions';

export default class UdpServer {
  constructor(store) {
    if (UdpServer.instance instanceof UdpServer) {
      return UdpServer.instance;
    }
    this.udp = NativeModules.RBUdpServer;
    this.event = new NativeEventEmitter(this.udp);
    this.store = store;
    this.startServer();

    this.onReceive();
  }

  startServer = () => {
    console.warn('init sercvcer');
    this.udp.initServer();
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
