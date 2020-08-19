import '../__Mocks__';
import MockData from '../__Mocks__/dataMock';
import Database from '../src/database/index';
import { bitcoin } from '../App';


// jest.mock('../src/utils/Bitcoin');
jest.mock('../src/database/realmDatabase');
const realm = new Database();

// describe('database realm test', () => {
//   test('initialize database ', async () => {
//     const db = await realm.getRealm(await bitcoin.sha256('123456'), await bitcoin.sha256sha256('click tag quit book door know comic alone elephant unhappy lunch sun'));
//     expect(db).toBeDefined();
//   });

describe('user functions', () => {
  test('add user', async () => {
    realm.writteUser(MockData.mockUser).then((res) => {
      expect(res).toEqual(MockData.mockUser);
    }).catch((err) => {
      expect(err).toBe(false);
    });
  });

  //     test('update the user photo address', async () => {
  //       MockData.mockUser.image = 'https:///test.locha.org';
  //       const obj = {
  //         uid: MockData.mockUser.uid,
  //         picture: MockData.mockUser.image
  //       };
  //       expect(realm.writteUser({
  //         ...obj
  //       })).resolves.toEqual(obj);
  //     });

  //     test('get user data', async () => {
  //       const data = await realm.getUserData();
  //       expect(data.length).toBeDefined();
  //     });
  //   });

  //   describe('Message functions', () => {
  //     test('save first message ', async () => {
  //       await expect(realm.setMessage('broadcast', MockData.mocksetMessage, 'pending')).resolves.toBeTruthy();
  //     });

  //     test('delete all messages', async () => {
  //       await expect(realm.cleanChat('broadcast')).resolves.toBeTruthy();
  //     });

  //     test('delete message', () => {
  //       realm.setMessage('broadcast', MockData.mocksetMessage2, 'pending').then(async () => {
  //         await expect(realm.deleteMessage('broadcast', [MockData.mocksetMessage2])).resolves.toBeTruthy();
  //       });
  //     });
  //   });
  //   test('update contact', async () => {
  //     MockData.mockContact.name = 'updated';
  //     await expect(realm.editContact(MockData.mockContact)).resolves.toEqual(MockData.mockContact);
  //   });

  //   test('verify that the contact exists', async () => {
  //     expect(realm.verifyContact(
  //       MockData.mockContact.hashUID
  //     )).resolves.toEqual(MockData.mockContact);
  //   });

  //   test('search for a non-existent contact', async () => {
  //     await expect(realm.verifyContact(
  //       MockData.mockContact2.hashUID
  //     )).resolves.toBe(undefined);
  //   });

  //   test('delete contatacs', async () => {
  //     const deleteContact = await realm.deleteContact([MockData.mockContact]);
  //     expect(deleteContact).toBe(true);
  //   });
  // });

  // test('added temporal contacts', async () => {
  //   await expect(
  //     realm.addTemporalInfo(MockData.temporalInfo)
  //   ).resolves.toEqual(MockData.temporalInfo);
  // });

  // test('Temporary contacts without passing required parameters', async () => {
  //   await expect(realm.addTemporalInfo(MockData.temporalInfo2)).rejects.toBeTruthy();
  // });

  // test('Get temporal contacts', async () => {
  //   await expect(
  //     realm.getTemporalContact(MockData.temporalInfo.hashUID)
  //   ).resolves.toBeTruthy();
});


afterAll(() => {
  realm.db.close();
  realm.seed.close();
  realm.listener.close();
});
