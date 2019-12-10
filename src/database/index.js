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
    toByteArray(str) {
        var array = new Int8Array(str.length);
        for (i = 0; i < str.length; i++) {
            array[i] = str.charCodeAt(i);
        }
        return array;
    }



    getRealm = (key, key2) => new Promise((resolve, reject) => {
        options.encryptionKey = this.toByteArray(key)
        optionsDatabase.encryptionKey = this.toByteArray(key2)
        console.log(Realm.copyBundledRealmFiles()) 
        try {
            this.seed = new Realm(options)
            this.db = new Realm(optionsDatabase)
            this.listener = new Realm(optionsDatabase)
            resolve(this.db)
        } catch (err) {
            console.log(err)
        }
    })


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



    setDataSeed = (data) => new Promise(resolve => {
        try {
            this.seed.write(() => {
                this.seed.create("Seed", {
                    id: sha256(data),
                    seed: data
                }, true)

                resolve()
            })
        } catch (err) {
            console.log("2", err)
        }
    })

    restoreWithPhrase = (pin, phrase) => new Promise(resolve => {
        this.getRealm(sha256(pin), sha256(phrase)).then(data => {
            this.setDataSeed(phrase).then(() => {
                resolve()
            })
        })
    })



    verifyPin = (pin) => new Promise((resolve, reject) => {
        try {
            options.encryptionKey = this.toByteArray(sha256(pin))
            new Realm(options)
            resolve()
        } catch (err) {
            reject(err)
        }
    })



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
}




