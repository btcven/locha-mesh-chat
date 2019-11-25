import Realm from 'realm';
import { WalletInfo } from './schemas';

const databaseOptions = {
    schema: [
      WalletInfo,
    ],
    schemaVersion: 1,
    encryptionKey: key
  };


  
const getRealm = (key) =>
new Promise(resolve => {
  resolve(Realm.open({schema: [
    WalletInfo,
  ],
  encryptionKey: key}));
});





