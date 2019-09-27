import { getChat } from "../store/chats";
import { reestarConnection, loading, loaded } from "../store/aplication";
import { getUserData } from "../database/realmDatabase";
import { sha256 } from "js-sha256";

export let sendSocket = undefined;

export default class Socket {
  constructor(store) {
    this.socket = new WebSocket("wss://lochat.coinlab.info");
    this.openSocketConnection();
    this.onMenssage();
    this.store = store;
    sendSocket = this.socket;
    this.checkingSocketStatus(store);
  }

  checkingSocketStatus = store => {
    setInterval(() => {
      if (this.socket.readyState !== 1) {
        this.store.dispatch(loading());
      } else {
        store.getState().aplication.loading === false
          ? null
          : this.store.dispatch(loaded());
      }
    }, 1000);
  };

  getSocket = () =>
    new Promise(resolve => {
      resolve(this.socket);
    });

  sendMenssage = data => {
    this.socket.send(data);
  };

  getUserObject = callback => {
    getUserData().then(res => {
      const object = {
        hashUID: sha256(res[0].uid),
        timestamp: new Date().getTime(),
        type: "handshake"
      };
      callback(object);
    });
  };

  openSocketConnection = async () => {
    this.getUserObject(res => {
      this.store.dispatch(loading());
      this.socket.onopen = () => {
        console.log("conecto");
        this.socket.send(JSON.stringify(res));
      };
    });
  };

  onMenssage = () => {
    this.socket.onmessage = e => {
      // a message was received
      this.store.dispatch(getChat(e.data));
    };

    this.socket.onerror = e => {
      // a message was received
      console.log("OnError", e);
    };

    this.socket.onclose = e => {
      this.store.dispatch(reestarConnection);
    };
  };
}
