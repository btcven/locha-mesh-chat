import '../__Mocks__';
import Realm from 'realm';
import { chatService } from '../app';
import store from '../src/store';
import { saveContact } from '../src/store/contacts/contactsActions';
import { createNewAccount } from '../src/store/aplication/aplicationAction';
import { messageType } from '../src/utils/constans';
import { getChatserviceInstance } from '../src/utils/utils';

const newContact = {
  name: 'TEST',
  picture: undefined,
  uid: 'TEST',
  hashUID: '94ee059335e587e501cc4bf90613e0814f00a7b08bc7c',
  nodeAddress: 'test'
};

const newContact2 = {
  name: 'TEST',
  picture: undefined,
  uid: '0202f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd91b0be9c052a30ba5bc1d9',
  hashUID: '94ee059335e587e501cc4bf90613e0814f00a7b08bc7c',
  nodeAddress: 'test'
};

const obj = {
  pin: '123456',
  seed: 'click tag quit book door know comic alone elephant unhappy lunch sun',
  name: 'test'
};

const mockMessage = {
  fromUID: '0202f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd91b0be9c052a30ba5bc1d9',
  toUID: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
  msg: {
    text: 'hello'
  },
  timestamp: new Date().getTime(),
  type: messageType.MESSAGE,
  msgID: 'test'
};

describe('test chat service component', () => {
  beforeAll(async () => {
    await store.dispatch(createNewAccount(obj));
    await store.dispatch(
      saveContact(
        '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1',
        newContact2,
        [],
        () => { }
      )
    );
  });

  test('send message', () => {
    const service = getChatserviceInstance();
    service.send('test');
  });

  test('send native dial', () => {
    const service = getChatserviceInstance();
    service.dial('test');
  });

  test('onMessage test', async () => {
    const service = getChatserviceInstance();
    await service.onMessage(JSON.stringify(mockMessage));
    mockMessage.toUID = undefined;
    await service.onMessage(JSON.stringify(mockMessage));
    mockMessage.toUID = 'broadcast';
    mockMessage.type = messageType.STATUS;
    await service.onMessage(JSON.stringify(mockMessage));
  });


  test('addNewAddressListen', async () => {
    const service = getChatserviceInstance();
    await service.addNewAddressListen('test', 'test');
  });

  afterAll(() => {
    Realm.deleteFile({
      path: 'mockDatabase/default.realm',
    });
    Realm.deleteFile({
      path: 'mockDatabase/seed.realm'
    });
  });
});
