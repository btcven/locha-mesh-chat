import crypto from "crypto";
import Bitcore from "bitcore-lib";
import Mnemonic from "bitcore-mnemonic";

const networkConfiguration = {
  network_data: "mainnet",
  bip44_id: 0
};
/**
 *
 *
 * @export
 * @class Bitcoin
 * @description here are all the functions of the wallet
 */

export default class Bitcoin {
  constructor() {
    this.WalletInfo = {};
    this.initialIndex = 0;
  }
  /**
   *
   * @function
   * @memberof Bitcoin
   * @description generate the private key and public key
   */
  generateAddress = async () => {
    let code;
    code = new Mnemonic();
    const password = "";

    var hdPrivateKey = code.toHDPrivateKey(
      password,
      networkConfiguration.network_data
    );

    let derivationPath = hdPrivateKey
      .derive(44, true)
      .derive(networkConfiguration.bip44_id, true)
      .derive(0, true)
      .derive(0);

    this.WalletInfo = derivationPath.derive(this.initialIndex).privateKey;

    console.log("acaaaaaaaaaaa", this.WalletInfo.toAddress().toString());
    return this.WalletInfo;
  };
}
