import { seed } from './schemas';
import Realm from 'realm';
// import {} from './realmDatabase'


export default class Seed {
    constructor(data) {
        this.getRealm()
    }

    getRealm = (key) => {
        const buffer = new ArrayBuffer(64);
        const view = new Int8Array(buffer);
        view.fill(key);
        this.realm = new Realm({
            schema: [
                seed,
            ],
            path: 'seed.realm',
            encryptionKey: view
        })
    }


    saveSeed = (data) => {
        this.realm.then(res => {
            res.write(() => {
                res.create(
                    "Seed",
                    {
                        seed: data
                    },
                );

                const hola = res.objects("Seed").map(res => {
                    console.log(res)
                })

            })
        })
    }


    getDataSeed = (pin) => {
                const seed = this.realm.objects("Seed")

                console.log("seed", seed)
            }
}
