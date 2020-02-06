import '../../__Mocks__';
import MockData from '../../__Mocks__/dataMock'
import store from '../../src/store';
import {
  verifyAplicationState,
  loading,
  loaded,
  createNewAccount,
  restoreWithPhrase,
  restoreAccountWithPin
} from '../../src/store/aplication/aplicationAction';
import { saveContact, editContats, deleteContactAction } from '../../src/store/contacts';
import { initialChat } from '../../src/store/chats/chatAction';
import { database } from '../../App';

describe('Aplication actions', () => {
  const obj = {
    pin: '123456',
    seed: 'click tag quit book door know comic alone elephant unhappy lunch sun',
    name: 'test'
  };

  test('check if the application status is not the initial', async () => {
    await store.dispatch(verifyAplicationState()).then(async () => {
      const newState = store.getState();

      expect(newState.aplication.appStatus).toBe('created');
    });
  });

  test('loading action', async () => {
    await store.dispatch(loading());

    const newState = store.getState();

    expect(newState.aplication.loading).toBe(true);
  });

  test('loaded action', async () => {
    await store.dispatch(loaded());

    const newState = store.getState();

    expect(newState.aplication.loading).toBe(false);
  });

  test('Create new account action', async () => {
    await store.dispatch(createNewAccount(obj)).then(() => {
      const newState = store.getState();
      const { config } = newState;
      expect({
        uid: config.uid,
        name: config.name
      }).toEqual({
        uid: '02676c01888dc0b31caceac3304dc1f5fb386ea4ab867492070c88b0eb0a91db2d',
        name: 'test'
      });
    });
  });

  test('restore account with words', async () => {
    await store.dispatch(restoreWithPhrase(obj.pin, obj.seed, obj.name)).then(() => {
      const newState = store.getState();
      const { config } = newState;
      expect({
        uid: config.uid,
        name: config.name
      }).toEqual({
        uid: '02676c01888dc0b31caceac3304dc1f5fb386ea4ab867492070c88b0eb0a91db2d',
        name: 'test'
      });
    });
  });

  test('restore account with pin ', async () => {
    await store.dispatch(restoreAccountWithPin(obj.pin, () => { })).then(() => {
      const newState = store.getState();
      const { config } = newState;
      expect({
        uid: config.uid,
        name: config.name
      }).toEqual({
        uid: '02676c01888dc0b31caceac3304dc1f5fb386ea4ab867492070c88b0eb0a91db2d',
        name: 'test'
      });
    });
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

    test('save contact action', async () => {
      await store.dispatch(saveContact(idUSer, newContact, [])).then(() => {
        const newState = store.getState();
        const { contacts } = newState;
        expect(contacts.contacts).toEqual(
          [{
            name: 'TEST',
            picture: null,
            uid: 'TEST',
            hashUID: '94ee059335e587e501cc4bf90613e0814f00a7b08bc7c'
          }]
        );
      });
    });
    test('Edit contact action', () => {
      newContact.name = 'hiii';
      store.dispatch(editContats(newContact, () => { })).then(() => {
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

  // --- CHAT ACTIONS -----
  describe('Chat Actions', () => {
    test('save new message ', async () => {
      await store.dispatch(initialChat(MockData.mocksetMessage3, 'pending')).then(() => {
        const newState = store.getState();
        const { chats } = newState;
        expect(chats.chat[0].messages[0].msgID).toBe('5c28f23b375d47994b30190b01338ea18daa0b307909a2d465a5977724634123');
      });
    });
  });

  
});


afterAll(() => {
  database.closeDB();
});
