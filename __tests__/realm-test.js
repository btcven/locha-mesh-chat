import '../__Mocks__';
import { sha256 } from 'js-sha256';
import MockData from '../__Mocks__/dataMock';
import Database from '../src/database/index';

const realm = new Database();

beforeAll(async () => {
  await realm.getRealm(sha256('123456'), sha256('123456'));
});
describe('database realm test', () => {
  test('add user', async () => {
    realm.writteUser(MockData.mockUser).then((res) => {
      expect(res).toEqual(MockData.mockUser);
    }).catch((err) => {
      expect(err).toBe(false);
    });
  });

  test('get user data', async () => {
    const data = await realm.getUserData();
    expect(data.length).toBeDefined();
  });


  // test('set message', () => {
  //   realm.setMessage('broadcast', MockData.mocksetMessage, 'pending').then((res) => {
  //     console.log("paso");
  //   }).catch(() => {
  //     console.log("no paso");
  //   })
  // });
});
