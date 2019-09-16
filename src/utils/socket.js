import { getChat } from "../store/chats";
import { reestarConnection } from "../store/aplication";

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
      this.socket.send(JSON.stringify("still alive"));
    }, 20000);
  };

  getSocket = () =>
    new Promise(resolve => {
      resolve(this.socket);
    });

  sendMenssage = data => {
    this.socket.send(data);
  };

  openSocketConnection = () => {
    console.log("conexion");
    this.socket.onopen = () => {
      console.log("ws connected");
    };
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
