import { getChat } from "../store/chats";
import { reestarConnection } from "../store/aplication";
import { getUserData } from "../database/realmDatabase";
import { sha256 } from "js-sha256";

export let sendSocket = undefined;

export default class Socket {
  constructor(store) {
    this.socket = new WebSocket("wss://lochat.coinlab.info");
    this.openSocketConnection();
    this.onMenssage();
    this.keepAlive();
    this.store = store;
    sendSocket = this.socket;
  }

  keepAlive = () => {
    setInterval(() => {
      this.getUserObject(res => {
        this.socket.send(JSON.stringify(res));
      });
    }, 20000);
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
        type: "still_alive"
      };
      callback(object);
    });
  };

  openSocketConnection = async () => {
    this.getUserObject(res => {
      res.timestamp = new Date().getTime();
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(res));
      };
    });
  };

  onMenssage = () => {
    this.socket.onmessage = e => {
      // a message was received

      console.log("acaaa", e.data);
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
