import crypto from "crypto";
import Bitcore from "bitcore-lib";
import Mnemonic from "bitcore-mnemonic";

const networkConfiguration = {
  network_data: "testnet",
  bip44_id: 0
};

export default class Bitcoin {
  constructor() {
    this.WalletInfo = {};
    this.initialIndex = 0;
  }

  generateAddress = async () => {
    let code;
    code = new Mnemonic(256);

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

    return this.WalletInfo;
  };
}
