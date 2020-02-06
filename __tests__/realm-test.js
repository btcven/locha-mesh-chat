// import '../__Mocks__';
// import { sha256 } from 'js-sha256';
// import MockData from '../__Mocks__/dataMock';
// import Database from '../src/database/index';

// const realm = new Database();

// describe('database realm test', () => {
//   test('initialize database ', async () => {
//     const db = await realm.getRealm(sha256('123456'), sha256('click tag quit book door know comic alone elephant unhappy lunch sun'));
//     expect(db).toBeDefined();
//   });

//   describe('user functions', () => {
//     test('add user', async () => {
//       realm.writteUser(MockData.mockUser).then((res) => {
//         expect(res).toEqual(MockData.mockUser);
//       }).catch((err) => {
//         expect(err).toBe(false);
//       });
//     });

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

//   test('update username', async () => {
//     const obj = {
//       uid: MockData.mockUser.uid,
//       name: 'new name'
//     };
//     await expect(realm.writteUser({
//       ...obj
//     })).resolves.toEqual(obj);
//   });

//   describe('Message functions', () => {
//     test('save first message ', async () => {
//       await expect(realm.setMessage('broadcast', MockData.mocksetMessage, 'pending')).resolves.toBeTruthy();
//     });

//     test('send messages when an error parameter is passed', async () => {
//       await expect(realm.setMessage()).rejects.toBeTruthy();
//     });

//     test('save message without your primary key', async () => {
//       MockData.mocksetMessage.msgID = undefined;
//       await expect(realm.setMessage('broadcast', MockData.mocksetMessage, 'pending')).rejects.toBeTruthy();
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

//   describe('contact functions', () => {
//     test('add contact', async () => {
//       await expect(realm.addContacts(
//         MockData.mockUser.uid,
//         [MockData.mockContact],
//         false
//       )).resolves.toEqual({
//         fromUID: MockData.mockUser.uid,
//         toUID: MockData.mockContact.hashUID,
//         messages: {},
//         queue: []
//       });
//     });

//     test('update contact', async () => {
//       MockData.mockContact.name = 'updated';
//       await expect(realm.editContact(MockData.mockContact)).resolves.toEqual(MockData.mockContact);
//     });

//     test('verify that the contact exists', async () => {
//       expect(realm.verifyContact(
//         MockData.mockContact.hashUID
//       )).resolves.toEqual(MockData.mockContact);
//     });

//     test('search for a non-existent contact', async () => {
//       await expect(realm.verifyContact(
//         MockData.mockContact2.hashUID
//       )).resolves.toBe(undefined);
//     });

//     test('delete contatacs', async () => {
//       const deleteContact = await realm.deleteContact([MockData.mockContact]);
//       expect(deleteContact).toBe(true);
//     });
//   });

//   test('added temporal contacts', async () => {
//     await expect(
//       realm.addTemporalInfo(MockData.temporalInfo)
//     ).resolves.toEqual(MockData.temporalInfo);
//   });

//   test('Temporary contacts without passing required parameters', async () => {
//     await expect(realm.addTemporalInfo(MockData.temporalInfo2)).rejects.toBeTruthy();
//   });

//   test('Get temporal contacts', async () => {
//     await expect(
//       realm.getTemporalContact(MockData.temporalInfo.hashUID)
//     ).resolves.toBeTruthy();
//   });
// });

// afterAll(() => {
//   realm.db.close();
//   realm.seed.close();
//   realm.listener.close();
// });
