import '../../__Mocks__';
import store from '../../src/store';
import { verifyAplicationState } from '../../src/store/aplication/aplicationAction';

describe('Aplication actions', () => {
  test('check if the application status is not the initial', async () => {
    await store.dispatch(verifyAplicationState()).then(async () => {
      const newState = store.getState();

      expect(newState.aplication.appStatus).toBe('created');
    });
  });
});
