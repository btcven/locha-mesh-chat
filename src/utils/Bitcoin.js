
import { NativeModules } from 'react-native';
import Sha256 from 'js-sha256';
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

  /**
   * function converts strings from string to sha256 format
   * @param {String} data  text to convert
   */
  sha256 = async (data) => {
    if (!process.env.JEST_WORKER_ID) {
      const sha256 = await this.bitcoinModule.sha256(data);
      return sha256;
    }
    const shajs = await Sha256(data);
    return shajs;
  }


  encrypt = async (message, key) => {
    const secureText = await this.bitcoinModule.encrypt(message, key);
    return secureText;
  }

  decrypt = async (secureText, key) => {
    const message = await this.bitcoinModule.decrypt(secureText, key);
    return message;
  }
}
