/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
import { sha256 } from 'js-sha256';
import Realm from 'realm';
import {
  seed,
  userSchema,
  contactSchema,
  chatSquema,
  BroadCasContacts,
  messageSquema,
  fileSchema
} from './schemas';
import CoreDatabase from './realmDatabase';

// let Realm;
// if (!process.env.JEST_WORKER_ID) {
//   Realm = require('realm');
// } else {
//   Realm = require('../../__Mocks__/realmMock').default;
// }


const options = {
  schema: [
    seed,
  ],
  path: 'mockDatabase/seed.realm',
  schemaVersion: 3,
};

const optionsDatabase = {
  path: 'mockDatabase/default.realm',
  schema: [
    userSchema,
    contactSchema,
    chatSquema,
    messageSquema,
    BroadCasContacts,
    fileSchema
  ],
  schemaVersion: 20
};

// CoreDatabase
export default class Database extends CoreDatabase {
  // eslint-disable-next-line class-methods-use-this

  // eslint-disable-next-line class-methods-use-this
  toByteArray(str) {
    const array = new Int8Array(str.length);
    for (let i = 0; i < str.length; i += 1) {
      array[i] = str.charCodeAt(i);
    }
    return array;
  }


  getRealm = (key, key2) => new Promise((resolve) => {
    options.encryptionKey = this.toByteArray(key);
    optionsDatabase.encryptionKey = this.toByteArray(key2);
    try {
      this.seed = new Realm(options);
      this.db = new Realm(optionsDatabase);
      this.listener = new Realm(optionsDatabase);
      resolve(this.db);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  })

  restoreWithPin = (key) => new Promise((resolve, reject) => {
    options.encryptionKey = this.toByteArray(key);
    try {
      this.seed = new Realm(options);
      const result = this.seed.objects('Seed');
      optionsDatabase.encryptionKey = this.toByteArray(result[0].id);
      this.db = new Realm(optionsDatabase);
      this.listener = new Realm(optionsDatabase);
      const userData = this.getUserData();
      resolve(userData);
    } catch (err) {
      reject(err);
    }
  })


  setDataSeed = (data) => new Promise((resolve) => {
    try {
      this.seed.write(() => {
        this.seed.create('Seed', {
          id: sha256(data),
          seed: data
        }, true);

        resolve();
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('2', err);
    }
  })

  restoreWithPhrase = (pin, phrase) => new Promise((resolve) => {
    this.getRealm(sha256(pin), sha256(phrase)).then(() => {
      this.setDataSeed(phrase).then(() => {
        resolve();
      });
    });
  })


  verifyPin = (pin) => new Promise((resolve, reject) => {
    try {
      options.encryptionKey = this.toByteArray(sha256(pin));
      // eslint-disable-next-line no-new
      new Realm(options);
      resolve();
    } catch (err) {
      reject(err);
    }
  })


  restoreWithFile = (pin, data) => new Promise((resolve) => {
    this.getRealm(sha256(pin), sha256(data.seed.seed)).then(async () => {
      const chats = Object.values(data.user.chats);
      const contacts = Object.values(data.user.contacts);

      for (let index = 0; index < chats.length; index += 1) {
        chats[index].messages = Object.values(chats[index].messages);
        chats[index].queue = [];
      }

      try {
        await this.setDataSeed(data.seed.seed);
        await this.writteUser({
          ...data.user,
          chats,
          contacts
        });
        resolve();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  })
}
