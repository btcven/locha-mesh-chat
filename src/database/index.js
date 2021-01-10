/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
import Realm from 'realm';
import {
  userSchema,
  contactSchema,
  chatSquema,
  broadcastContacts,
  messageSquema,
  fileSchema,
  seed
} from './schemas';
import CoreDatabase from './realmDatabase';
import { bitcoin } from '../../App';

let pathDefault;
let pathSeed;
if (!process.env.JEST_WORKER_ID) {
  pathDefault = 'default.realm';
  pathSeed = 'seed.realm';
} else {
  pathDefault = 'mockDatabase/default.realm';
  pathSeed = 'mockDatabase/seed.realm';
}


const options = {
  schema: [
    seed,
  ],
  path: pathSeed,
  schemaVersion: 3,
};

const optionsDatabase = {
  path: pathDefault,
  schema: [
    userSchema,
    contactSchema,
    chatSquema,
    messageSquema,
    broadcastContacts,
    fileSchema
  ],
  schemaVersion: 25
};

// CoreDatabase
export default class Database extends CoreDatabase {
  /**
   * @function
   * @description convert the password to buffer format
   * @param {String} str password
   * @return {String}
   */
  // eslint-disable-next-line class-methods-use-this

  // eslint-disable-next-line class-methods-use-this
  toByteArray(str) {
    const array = new Int8Array(str.length);
    for (let i = 0; i < str.length; i += 1) {
      array[i] = str.charCodeAt(i);
    }
    return array;
  }

  /**
   * @function
   * @description function used to add the password to the database
   * @param {String} key1 realm password where words are saved
   * @param {String} key2  realm password where user data is stored
   * @return {Promise}
   */

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
      console.log('getRealm', err);
    }
  })

  /**
   * @function
   * @description function that saves the words in the database
   * @param {String} key pin
   * @return {Promise}
   */
  // eslint-disable-next-line no-async-promise-executor
  restoreWithPin = (key) => new Promise(async (resolve, reject) => {
    options.encryptionKey = this.toByteArray(key);
    try {
      this.seed = new Realm(options);
      const result = this.seed.objects('Seed');
      optionsDatabase.encryptionKey = this.toByteArray(result[0].id);
      this.db = new Realm(optionsDatabase);
      this.listener = new Realm(optionsDatabase);
      const userData = await this.getUserData();
      this.realmObservable();
      resolve({ user: userData, seed: this.seed.objects('Seed') });
    } catch (err) {
      reject(err);
    }
  })

  /**
   * @function
   * @description function that saves the words in the database
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  setDataSeed = (phrases) => new Promise(async (resolve) => {
    id = await bitcoin.sha256(phrases);
    try {
      this.seed.write(() => {
        this.seed.create('Seed', {
          id,
          seed: phrases
        }, true);
        this.realmObservable();
        resolve();
      });
    } catch (err) {
      // eslint-disable-next-line no-console
    }
  })

  /**
   * @function
   * @description Function to restore account with words
   * @param {String} phrases account phrases
   * @param {String} pin  New pin
   * @return {Promise}
   */
  restoreWithPhrase = (pin, phrase) => new Promise(async (resolve) => {
    this.getRealm(await bitcoin.sha256(pin), await bitcoin.sha256(phrase)).then(() => {
      this.setDataSeed(phrase).then(() => {
        this.realmObservable();
        resolve();
      });
    });
  })

  /**
   * @function
   * @description Function that verifies that the entered is correct
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  verifyPin = (pin) => new Promise(async (resolve, reject) => {
    try {
      options.encryptionKey = this.toByteArray(await bitcoin.sha256(pin));
      // eslint-disable-next-line no-new
      new Realm(options);
      resolve();
    } catch (err) {
      reject(err);
    }
  })

  closeDB() {
    if (this.db) {
      this.db.close();
    }
    if (this.seed) {
      this.seed.close();
    }
    if (this.listener) {
      this.listener.close();
    }
  }

  /**
   * @function
   * @description Function to restore account with files
   * @param {String} phrases account phrases
   * @param {String} pin  New pin
   * @return {Promise}
   */
  restoreWithFile = (pin, data) => new Promise(async (resolve) => {
    this.getRealm(await bitcoin.sha256(pin), await bitcoin.sha256(data.seed.seed)).then(async () => {
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
        this.realmObservable();
        resolve();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  })

  /**
   * @function
   * @description Function to verify if the words are correct to retrieve the pin
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  verifyPhrases = (phrases) => new Promise(async (resolve, reject) => {
    try {
      optionsDatabase.encryptionKey = this.toByteArray(await bitcoin.sha256(phrases));
      // eslint-disable-next-line no-new
      new Realm(optionsDatabase);
      const deletePath = `${Realm.defaultPath.substring(0, Realm.defaultPath.lastIndexOf('/'))}/${options.path}`;
      resolve(deletePath);
    } catch (error) {
      reject();
    }
  })

  /**
   * @function
   * @description Function to add a new pin
   * @param {String} pin  New pin
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  newPin = (pin, phrase) => new Promise(async (resolve) => {
    this.getRealm(await bitcoin.sha256(pin), await bitcoin.sha256(phrase)).then(() => {
      this.setDataSeed(phrase).then(async () => {
        const userData = await this.getUserData();
        resolve(userData);
      });
    });
  })
}
