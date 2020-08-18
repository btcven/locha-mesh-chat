
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

  /**
   * this function executes the native code used to create the wallet
   * @param {String} mnemonic phrases to create the wallet
   */
  createWallet = async (mnemonic) => {
    const keys = await this.bitcoinModule.createWallet(mnemonic);
    return keys;
  }

  /**
   * used to get the publickey once the wallet has already been created
   * @returns String
   */
  getPubKey = async () => {
    const pubKey = await this.bitcoinModule.getPublicKey();
    return pubKey;
  }

  /**
  * used to get the privateKey once the wallet has already been created
  * @returns String
  */
  getPrivKey = async () => {
    const privKey = await this.bitcoinModule.getPrivateKey();
    return privKey;
  }
  /**
   * used to get the mnemonic to start the wallet
   * @returns String
   */

  getNewMnemonic = async () => {
    const stringMnemonic = await this.bitcoinModule.generateMnemonic();
    return stringMnemonic;
  }
}
