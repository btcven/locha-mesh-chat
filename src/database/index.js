import { seed } from './schemas';
import Realm from 'realm';
import { sha256 } from 'js-sha256';
import Bitcoin from '../utils/Bitcoin'

import CoreDatabase from './realmDatabase'

import {
  userSchema,
  contactSchema,
  chatSquema,
  BroadCasContacts,
  messageSquema
} from "./schemas";


const options =
{
  schema: [
    seed,
  ],
  path: 'seed.realm',
  schemaVersion: 2,
}

const optionsDatabase = {
  path: 'default.realm',
  schema: [
    userSchema,
    contactSchema,
    chatSquema,
    messageSquema,
    BroadCasContacts,
    fileSchema
  ],
  schemaVersion: 18
}



export default class Database extends CoreDatabase {
  constructor() {
    super()
  }

  /**
   * @function
   * @description convert the password to buffer format
   * @param {String} str password
   * @return {String}
   */
  toByteArray(str) {
    var array = new Int8Array(str.length);
    for (i = 0; i < str.length; i++) {
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

  getRealm = (key, key2) => new Promise((resolve, reject) => {
    options.encryptionKey = this.toByteArray(key)
    optionsDatabase.encryptionKey = this.toByteArray(key2)

    try {
      this.seed = new Realm(options)
      this.db = new Realm(optionsDatabase)
      this.listener = new Realm(optionsDatabase)
      resolve(this.db)
    } catch (err) {
      console.log(err)
    }
  })

  /**
   * @function
   * @description function that saves the words in the database
   * @param {String} key pin
   * @return {Promise}
   */
  restoreWithPin = (key) => new Promise(async (resolve, reject) => {
    options.encryptionKey = this.toByteArray(key)
    try {
      this.seed = new Realm(options)
      const result = this.seed.objects('Seed')
      optionsDatabase.encryptionKey = this.toByteArray(result[0].id)
      this.db = new Realm(optionsDatabase)
      this.listener = new Realm(optionsDatabase)
      const userData = await this.getUserData()
      resolve(userData);
    } catch (err) {
      reject(err)
    }
  })

  /**
   * @function
   * @description function that saves the words in the database
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  setDataSeed = (phrases) => new Promise(resolve => {
    try {
      this.seed.write(() => {
        this.seed.create("Seed", {
          id: sha256(data),
          seed: phrases
        }, true)

        resolve()
      })
    } catch (err) {
      console.log("2", err)
    }
  })

  /**
   * @function
   * @description Function to restore account with words
   * @param {String} phrases account phrases
   * @param {String} pin  New pin
   * @return {Promise}
   */
  restoreWithPhrase = (pin, phrase) => new Promise(resolve => {
    this.getRealm(sha256(pin), sha256(phrase)).then(data => {
      this.setDataSeed(phrase).then(() => {
        resolve()
      })
    })
  })

  /**
   * @function
   * @description Function that verifies that the entered is correct
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  verifyPin = (pin) => new Promise((resolve, reject) => {
    try {
      options.encryptionKey = this.toByteArray(sha256(pin))
      new Realm(options)
      resolve()
    } catch (err) {
      reject(err)
    }
  })

  /**
   * @function
   * @description Function to restore account with files
   * @param {String} phrases account phrases
   * @param {String} pin  New pin
   * @return {Promise}
   */
  restoreWithFile = (pin, data) => new Promise((resolve, reject) => {
    this.getRealm(sha256(pin), sha256(data.seed.seed)).then(async () => {

      const chats = Object.values(data.user.chats)
      const contacts = Object.values(data.user.contacts)

      for (let index = 0; index < chats.length; index++) {
        chats[index].messages = Object.values(chats[index].messages)
        chats[index].queue = []
      }

      try {
        await this.setDataSeed(data.seed.seed)
        await this.writteUser({
          ...data.user,
          chats, contacts
        })
        resolve()
      } catch (err) {
        console.log(err)
      }
    })
  })

  /**
   * @function
   * @description Function to verify if the words are correct to retrieve the pin
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  verifyPhrases = (phrases) => new Promise((resolve, reject) => {
    try {
      optionsDatabase.encryptionKey = this.toByteArray(sha256(phrases))
      const db = new Realm(optionsDatabase)
      const deletePath = Realm.defaultPath.substring(0, Realm.defaultPath.lastIndexOf('/')) + "/" + options.path
      resolve(deletePath)
    } catch (error) {
      reject()
    }
  })

  /**
   * @function
   * @description Function to add a new pin
   * @param {String} pin  New pin
   * @param {String} phrases account phrases
   * @return {Promise}
   */
  newPin = (pin, phrase) => new Promise((resolve, reject) => {
    this.getRealm(sha256(pin), sha256(phrase)).then(data => {
      this.setDataSeed(phrase).then(async () => {
        const userData = await this.getUserData()
        resolve(userData);
      })
    })
  })
}






