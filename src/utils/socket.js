import { getChat } from "../store/chats";

export default class Socket {
  constructor(store) {
    this.socket = new WebSocket("wss://lochat.coinlab.info");
    this.onMenssage();
    this.store = store;
  }

  getSocket = () =>
    new Promise(resolve => {
      resolve(this.socket);
    });

  sendMenssage = data => {
    console.log("data", data);
    this.socket.send(data);
  };

  onMenssage = () => {
    this.socket.onopen = () => {
      console.log("ws connected");
    };

    this.socket.onmessage = e => {
      // a message was received

      this.store.dispatch(getChat(e.data));
    };

    this.socket.onerror = e => {
      // a message was received
      console.log("OnError", e);
    };

    this.socket.onclose = e => {
      // connection closed
      console.log("se ejecuto el closed");
    };
  };
}
