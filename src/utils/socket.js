import { sha256 } from 'js-sha256';
import { getChat, setStatusMessage } from '../store/chats';
import { requestImageStatus, sentImageStatus, verifyHashImageStatus } from '../store/contacts/contactsActions';
import { reestarConnection, loading, loaded } from '../store/aplication';

// eslint-disable-next-line import/no-mutable-exports
export let sendSocket;

/**
 *
 * websocket client management class
 * @export
 * @class Socket
 */

export default class Socket {
  constructor(store, database, url) {
    this.url = url || 'wss://lochat.coinlab.info';
    // eslint-disable-next-line no-undef
    this.socket = new WebSocket(this.url);
    this.database = database;
    this.openSocketConnection();
    this.onMenssage();
    this.store = store;
    sendSocket = this.socket;
    this.checkingSocketStatus(store);
    this.idInterval = undefined;
  }

  closeTimmer = () => {
    clearInterval(this.idInterval);
  };

  /**
   * @function
   * @description websocket client management class
   * @memberof Socket
   */
  checkingSocketStatus = (store) => {
    this.idInterval = setInterval(() => {
      if (this.socket.readyState !== 1 && this.socket.readyState !== 3) {
        if (!store.getState().aplication.loading) {
          this.store.dispatch(loading());
        }
      } else if (this.socket.readyState === 3) {
        this.closeTimmer();
      } else {
        // eslint-disable-next-line no-unused-expressions
        store.getState().aplication.loading === false
          ? null
          : this.store.dispatch(loaded());
      }
    }, 1000);
  };

  /**
   * @function
   * @description Sending messages
   * @memberof Socket
   */
  sendMenssage = (data) => {
    this.socket.send(data);
  };

  /**
   * @function
   * @description makes a request to the database looking for user data to pass
   * them to the initial connection
   * @param {callback} callback
   * @memberof Socket
   */

  getUserObject = (callback) => {
    try {
      this.database.getUserData().then((res) => {
        const object = {
          hashUID: sha256(res[0].uid),
          timestamp: new Date().getTime(),
          type: 'handshake'
        };
        callback(object);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  /**
   * @function
   * @description start the connection to the socket
   * @memberof Socket
   */

  openSocketConnection = async () => {
    this.getUserObject((res) => {
      this.store.dispatch(loading());
      this.socket.onopen = () => {
        // eslint-disable-next-line no-console
        console.log('conecto');
        this.socket.send(JSON.stringify(res));
      };
    });
  };

  /**
   *
   * @function
   * @description contains the onMessage, onError and onClose of the webscket
   * @memberof Socket
   */

  connectionRetry = () => {
    setTimeout(() => {
      reestarConnection(this.store);
    }, 10000);
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

  /**
   * it is executed when a new data arrives at websocket
   */
  onMenssage = () => {
    this.socket.onmessage = (e) => {
      // a message was received
      const parse = JSON.parse(e.data);
      const { dispatch } = this.store;
      switch (parse.type) {
        case 'status': this.setStatus(parse);
          break;
        // Execute function that is in chat actions
        case 'msg': dispatch(getChat(parse));
          break;
        default:
          break;
      }
    };

    this.socket.onerror = (e) => {
      // a message was received
      // eslint-disable-next-line no-console
      console.log('OnError', e);
    };

    this.socket.onclose = (e) => {
      // eslint-disable-next-line no-console
      console.log('close', e);
      this.connectionRetry();
    };
  };
}
