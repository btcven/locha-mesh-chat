import { NativeModules, NativeEventEmitter } from 'react-native';

export default class ChatService {
  constructor() {
    if (ChatService.instance) {
      return ChatService.instance;
    }

    this.service = NativeModules.ChatService;
    this.event = new NativeEventEmitter(this.service);

    this.service.start("aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899");

    this.onNewMessage();
    this.onNewListenAddr();

    ChatService.instance = this;

    this.service.dial("/ip4/192.168.0.25/tcp/41381");
    return this;
  }

  stop = () => {
    this.service.stop();
  }

  dial = (multiaddr) => {
    this.service.dial(multiaddr);
  }

  send = (message) => {
    this.service.sendMessage(message);
  }

  onNewMessage = () => {
    this.event.addListener('newMessage', ((message) => {
      console.log(message);
    }))
  }

  onNewListenAddr = () => {
    this.event.addListener('newListenAddr', ((multiaddr) => {
      console.log(multiaddr);
    }))
  }
}
