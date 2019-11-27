import { seed } from './schemas';
import Realm from 'realm';
import { sha256 } from 'js-sha256';
import Bitcoin from '../utils/Bitcoin'

// import {} from './realmDatabase'

import {
    userSchema,
    contactSchema,
    chatSquema,
    BroadCasContacts,
    messageSquema
} from "./schemas";


export default class Database {
    constructor() {
    }


    toByteArray(str) {
        var array = new Int8Array(str.length);
        for (i = 0; i < str.length; i++) {
            array[i] = str.charCodeAt(i);
        }
        return array;
    }



    getRealm = (key, key2) => new Promise((resolve, reject) => {
        const keySeed = this.toByteArray(key)
        const keyDatabase = this.toByteArray(key2)
        try {
            this.seed = new Realm({
                schema: [
                    seed,
                ],
                path: 'seed.realm',
                schemaVersion: 2,
                encryptionKey: keySeed
            })

            this.database = new Realm({
                schema: [
                    userSchema,
                    contactSchema,
                    chatSquema,
                    messageSquema,
                    BroadCasContacts,
                    fileSchema
                ],
                encryptionKey: keyDatabase,
                schemaVersion: 16
            })

            resolve(this.database)
        } catch (err) {
            console.log(err)
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
}
