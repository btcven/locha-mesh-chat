import crypto from "crypto";
import Bitcore from "bitcore-lib";
import Mnemonic from "bitcore-mnemonic";
import AsyncStorage from "@react-native-community/async-storage";

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
    const result = await AsyncStorage.getItem("words");
    console.log("result", result);
    if (!result) {
      console.log("paso el if");
      code = new Mnemonic(256);
      console.log(code.toString());
      await AsyncStorage.setItem("words", code.toString());
    } else {
      console.log("no lo paso");
      code = new Mnemonic(result);
    }

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
