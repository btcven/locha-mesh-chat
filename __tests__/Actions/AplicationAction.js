import '../../__Mocks__';
import MockData from '../../__Mocks__/dataMock';
import store from '../../src/store';
import {
  verifyAplicationState,
  loading,
  createNewAccount,
  restoreAccountWithPin
} from '../../src/store/aplication/aplicationAction';
import { editContacts, deleteContactAction } from '../../src/store/contacts';
import {
  enableBroadcast,
  disableBroadcast,
  initialChat,
  realoadBroadcastChat,
  playAction,
  closedPlayer,
  stopPlaying,
  startManualService,
  deleteChat,
  cleanAllChat,
  deleteMessages,
  sendAgain,
  getChat,
  setView
} from '../../src/store/chats';
import { database } from '../../App';

describe('Aplication actions', () => {
  const obj = {
    pin: '123456',
    seed: 'click tag quit book door know comic alone elephant unhappy lunch sun',
    name: 'test'
  };
  const sendObject = {
    toUID: 'broadcast',
    msg: {
      text: 'test',
      typeFile: 'image',
      file: 'test'
    },
    id: 'test',
    msgID: 'test',
    timestamp: new Date().getTime(),
    type: 1
  };


  beforeAll(async () => {
    await store.dispatch(createNewAccount(obj));
  });

  test('check if the application status is not the initial', async () => {
    await store.dispatch(verifyAplicationState()).then(async () => {
      const newState = store.getState();

      expect(newState.aplication.appStatus).toBe('created');
    });
  });

  test('restore account with pin', async () => {
    await store.dispatch(restoreAccountWithPin(obj.pin, () => { }));
    expect(store.getState().config.name).toBe('test');
  });

  test('loading action', async () => {
    await store.dispatch(loading());

    const newState = store.getState();

    expect(newState.aplication.loading).toBe(true);
  });

  test('enabling broadcast chat', async () => {
    await store.dispatch(enableBroadcast(() => {
      const newState = store.getState();
      expect(newState.chats.broadcast).toBe(true);
    }));
  });

  test('disabling broadcast chat', async () => {
    await store.dispatch(disableBroadcast(() => {
      const newState = store.getState();
      expect(newState.chats.broadcast).toBe(false);
    }));
  });

  // --- CONTACT ACTIONS -----
  describe('contact action', () => {
    const idUSer = '02676c01888dc0b31caceac3304dc1f5fb386ea4ab867492070c88b0eb0a91db2d';
    const newContact = {
      name: 'TEST',
      picture: undefined,
      uid: 'TEST',
      hashUID: '94ee059335e587e501cc4bf90613e0814f00a7b08bc7c'
    };
    test('Edit contact action', () => {
      newContact.name = 'hiii';
      store.dispatch(editContacts(newContact, () => { })).then(() => {
        const newState = store.getState();
        const { contacts } = newState;
        expect(contacts.contacts).toEqual(
          [{
            name: 'hiii',
            picture: null,
            uid: 'TEST',
            hashUID: '94ee059335e587e501cc4bf90613e0814f00a7b08bc7c'
          }]
        );
      });
    });

    test('Delete contact action', async () => {
      await store.dispatch(deleteContactAction([newContact], () => { })).then(() => {
        const newState = store.getState();
        const { contacts } = newState;
        expect(contacts.contacts).toEqual(
          []
        );
      });
    });
  });

  describe('chat action', () => {
    test('start manual service', () => {
      store.dispatch(startManualService((res) => {
        expect(res).toBe(true);
      }));
    });

    test('getChat function', () => {
      const sendObject2 = {
        toUID: 'broadcast',
        msg: {
          text: 'test',
          typeFile: 'image',
          file: 'test'
        },
        id: 'test',
        msgID: 'test2',
        timestamp: new Date().getTime(),
        type: 1
      };
      store.dispatch(getChat(JSON.stringify(sendObject2)));
      expect(store.getState().chats.chat.length).toBe(1);
    });

    test('set View actions', async () => {
      await store.dispatch(setView('broadcast', 'test'));
      expect(store.getState().chats.chat[0].queue.length).toBe(0);
    });

    test('send message', async () => {
      const fromUID = 'test123test123';

      await store.dispatch(initialChat(fromUID, sendObject, 'pending'));

      expect(store.getState().chats.chat).toBeDefined();
    });

    test('send again', async () => {
      await store.dispatch(sendAgain(sendObject, new Date().getTime()));
    });

    test('delete message inside the view chat', async () => {
      await store.dispatch(deleteChat([sendObject], () => { }));

      setTimeout(() => {
        expect(store.getState().chats.chat.length).toBe(0);
        const fromUID = 'test123test123';
        store.dispatch(initialChat(fromUID, sendObject, 'pending'));
      }, 200);
    });

    test('clean chat', async () => {
      store.dispatch(cleanAllChat('broadcast'));

      expect(store.getState().chats.insideChat.length).toBe(0);
    });

    test('delete selected messages', async () => {
      const fromUID = 'test123test123';
      await store.dispatch(initialChat(fromUID, sendObject, 'pending'));

      setTimeout(() => {
        store.dispatch(deleteMessages('broadcast', [sendObject], () => { }));
        expect(store.getState().chats.insideChat.length).toBe(0);
      }, 100);
    });

    test('realoadBroadcastChat', () => {
      store.dispatch(realoadBroadcastChat([]));
      const { chat } = store.getState().chats;
      expect(chat.length).toBe(0);
    });

    test('play action function', () => {
      store.dispatch(playAction({
        keyPlayer: 'test',
        isPlaying: true
      }));

      expect(store.getState().chats.keyPlayer).toBe('test');
    });

    test('function to stop playback', async () => {
      await store.dispatch(closedPlayer());

      await expect(store.getState().chats.keyPlayer).toBe(null);
    });

    test('function stopPlaying', () => {
      store.dispatch(stopPlaying(true));

      expect(store.getState().chats.forcedPause).toBe(true);
    });
  });
});


afterAll(() => {
  database.closeDB();
});
