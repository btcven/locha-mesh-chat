
import { NativeModules } from 'react-native';

/**
 *
 * @export
 * @class Bitcoin
 * @description here are all the functions of the wallet
 */

export default class Bitcoin {
  constructor() {
    this.WalletInfo = {};
    this.initialIndex = 0;
    this.bitcoinModule = NativeModules.bitcoinModule;
  }


  createWallet = async (mnemonic) => {
    const keys = await this.bitcoinModule.createWallet(mnemonic);
    return keys;
  }


  getPubKey = async () => {
    const pubKey = await this.bitcoinModule.getPublicKey();
    return pubKey;
  }

  getPrivKey = async () => {
    const privKey = await this.bitcoinModule.getPrivateKey();
    return privKey;
  }

  getNewMnemonic = async () => {
    const stringMnemonic = await this.bitcoinModule.generateMnemonic();
    return stringMnemonic;
  }
}
