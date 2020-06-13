
// import { sha256 } from 'js-sha256';
// import { NativeModules, NativeEventEmitter } from 'react-native';
// import { getChat, setStatusMessage } from '../store/chats';
// import { requestImageStatus, sentImageStatus, verifyHashImageStatus } from '../store/contacts/contactsActions';
// import { reestarConnection, loading, loaded } from '../store/aplication';
// import { messageType } from './constans';

// // eslint-disable-next-line import/no-mutable-exports
// export let socket;

// /**
//  *
//  * websocket client management class
//  * @export
//  * @class Socket
//  */

// const ws = NativeModules.RNWebsocketModule;

// export default class Socket {
//   constructor(store, database, url) {
//     // singleton class
//     if (Socket.instance instanceof Socket) {
//       return Socket.instance;
//     }

//     // this.url = url || 'wss://192.168.4.1:443/ws';
//     // this.init();
//     // this.database = database;
//     // this.eventEmitter = new NativeEventEmitter(ws);
//     // this.onOpen();
//     // this.onMessage();
//     // this.onClose();
//     // this.onError();
//     // this.store = store;
//     // socket = ws;
//     // this.isConnected = false;
//     // this.checkingSocketStatus(store);
//     // this.idInterval = undefined;
//     // Socket.instance = this;
//   }

//   closeTimmer = () => {
//     clearInterval(this.idInterval);
//   };

//   init() {
//     ws.instantiateWeboscket(this.url);
//   }

//   /**
//    * @function
//    * @description websocket client management class
//    * @memberof Socket
//    */
//   checkingSocketStatus = (store) => {
//     this.idInterval = setInterval(() => {
//       if (!this.isConnected) {
//         if (!store.getState().aplication.loading) {
//           this.store.dispatch(loading());
//         }
//       } else {
//         // eslint-disable-next-line no-unused-expressions
//         store.getState().aplication.loading === false
//           ? null
//           : this.store.dispatch(loaded());
//       }
//     }, 1000);
//   };

//   /**
//    * @function
//    * @description Sending messages
//    * @memberof Socket
//    */
//   sendMenssage = (data) => {
//     ws.sendSocket(data);
//   };

//   /**
//    * @function
//    * @description makes a request to the database looking for user data to pass
//    * them to the initial connection
//    * @param {callback} callback
//    * @memberof Socket
//    */

//   getUserObject = (callback) => {
//     try {
//       this.database.getUserData().then((res) => {
//         const object = {
//           shaUID: sha256(res[0].uid),
//           timestamp: new Date().getTime(),
//           type: 0
//         };
//         callback(object);
//       });
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.log(error);
//     }
//   };

//   /**
//    * @function
//    * @description start the connection to the socket
//    * @memberof Socket
//    */

//   onOpen = () => {
//     this.eventEmitter.addListener('onOpen', (isConnected) => {
//       this.isConnected = isConnected;
//       if (isConnected) {
//         this.getUserObject((user) => {
//           ws.sendSocket(JSON.stringify(user));
//         });
//       }
//     });
//   }

//   onMessage = () => {
//     this.eventEmitter.addListener('onMessage', (message) => {
//       const parse = JSON.parse(message);
//       const { dispatch } = this.store;
//       switch (parse.type) {
//         case messageType.MESSAGE: dispatch(getChat(parse));
//           break;
//         // Execute function that is in chat actions
//         case messageType.STATUS: this.setStatus(parse);
//           break;
//         default:
//           break;
//       }
//     });
//   }

//   onError = () => {
//     this.eventEmitter.addListener('onError', (error) => {
//       console.log('[error]: ', error);
//       this.isConnected = false;
//       this.connectionRetry();
//     });
//   }

//   onClose = () => {
//     this.eventEmitter.addListener('onClose', (close) => {
//       console.warn('[onClose]: ', close);
//     });
//   }

//   /**
//    *
//    * @function
//    * @description contains the onMessage, onError and onClose of the webscket
//    * @memberof Socket
//    */

//   connectionRetry = () => {
//     setTimeout(() => {
//       reestarConnection(this.store);
//     }, 10000);
//   }

//   /**
//   * function that is executed when the socket returns a status object
//   * @param {Object} statusData
//   * @param {string} statusData.toUID address where the status will be sent
//   * @param {string} statusData.fromUID ui of the one that is receiving in state
//   * @param {number} statusData.timestamp sent date
//   * @param {string} statusData.type type status
//   * @param {Object} statusData.data object that contains the status data
//   */

//   setStatus = async (statusData) => {
//     const { dispatch } = this.store;
//     switch (statusData.data.status) {
//       // execute function that is in contact actions
//       case 'RequestImage': dispatch(requestImageStatus(statusData));
//         break;
//       // Execute function that is in contact actions
//       case 'sentImage': dispatch(sentImageStatus(statusData));
//         break;
//       // Execute function that is in contact actions
//       case 'verifyHashImage': dispatch(verifyHashImageStatus(statusData));
//         break;
//       // Execute function that is in chat actions
//       default: dispatch(setStatusMessage(statusData));
//         break;
//     }
//   };
// }
