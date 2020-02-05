import '../../__Mocks__';
import store from '../../src/store';
import {
  verifyAplicationState,
  loading,
  loaded,
  createNewAccount,
  restoreWithPhrase,
  restoreAccountWithPin
} from '../../src/store/aplication/aplicationAction';

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
        uid: '02e5f8f594f8ca7e27d0f0b3e37432bcad4c066f4bbd91b0be9c052a36ba5bc1d6',
        name: 'new name'
      });
    });
  });
});
