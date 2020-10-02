package BitcoinJ;

import android.util.Base64;
import android.util.Log;

import com.google.common.base.Joiner;

import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.core.Sha256Hash;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.crypto.MnemonicCode;
import org.bitcoinj.crypto.MnemonicException;
import org.bitcoinj.params.TestNet3Params;
import org.bitcoinj.script.Script;
import org.bitcoinj.wallet.DeterministicKeyChain;
import org.bitcoinj.wallet.DeterministicSeed;
import org.bitcoinj.wallet.Wallet;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class CryptoLib {
    public static final String TAG = "Bitcoin_Module";
    private static final int ENTROPY_BITS = 128;
    Wallet wallet;
    EncryptorAES encryptorAES;
    private  boolean walletIscreated = false;

    public CryptoLib() {
        encryptorAES = new EncryptorAES();
    }

    /**
     * this function generates the words used when creating the wallet
     * @return  String
     */
    public String generateMnemonic()  {
        try {
            int entropyLen = ENTROPY_BITS / 8;
            byte[] entropy = generateEntropy(entropyLen);
            List<String> words = null;
            words = MnemonicCode.INSTANCE.toMnemonic(entropy);
            String mnemonic = Joiner.on(" ").join(words);

            return mnemonic;
        } catch (MnemonicException.MnemonicLengthException e) {
            return null;
        }
    }

    /**
     * returns the secure random used to generate the mnemonic
     * @param entropyLen
     * @return byte[]
     */
    private static byte[] generateEntropy(int entropyLen) {
        byte[] entropy = new byte[entropyLen];
        SecureRandom random = new SecureRandom();
        random.nextBytes(entropy);
        return entropy;
    }

    /**
     * create the wallet and return the private and public keys
     * @param mnemonic
     * @return HashMap<String, String>
     */


    public HashMap<String, String> createWallet(String mnemonic){
        NetworkParameters params = TestNet3Params.get();
        List<String> list = new ArrayList<String>();

        list.addAll(Arrays.asList(mnemonic.split(" ")));
        DeterministicSeed seed = new DeterministicSeed(list, null, "", System.currentTimeMillis());

        wallet = Wallet.fromSeed(
                params,
                seed,
                Script.ScriptType.P2PKH
        );

        walletIscreated = true;


        DeterministicKeyChain deterministicKeyChain = wallet.getActiveKeyChain();
        DeterministicKey account = deterministicKeyChain.getWatchingKey();

        Log.i(TAG, "private: " + account.getPrivateKeyAsHex());
        Log.i(TAG, "public: " + account.getPublicKeyAsHex());

        HashMap walletKeys =  new HashMap<String, String>();


        walletKeys.put("privKey", account.getPrivateKeyAsHex());
        walletKeys.put("pubKey", account.getPublicKeyAsHex());


        return walletKeys;
    }


    /**
     *  used to get the privateKey once the wallet has already been created
     *
     * @return
     */
    public String getPrivateKey(){
        if(walletIscreated) {
            DeterministicKey key = wallet.getWatchingKey();
            String xpriv = key.getPrivateKeyAsHex();
            return xpriv;
        }else{
           return null;
        }
    }

    /**
     *  function converts strings from string to sha256 format
     * @param data text to convert
     * @
     */
     public String sha256(String data){
        try {
            byte[] b = data.getBytes();

            Sha256Hash sha256Hash =  Sha256Hash.of(b);

            Log.i(TAG, "sha256"+  sha256Hash.toString());

            return sha256Hash.toString();
        } catch (Exception e){
            return null;
        }

    }


    /**
     * function used to encrypt a text string
     *
     * @param message  text to encrypt
     * @param key  key
     *
     */
     public String encrypt(String message, String key)  {
       try{
            byte[] _message  = message.getBytes("UTF-16LE");
            byte [] _key = key.getBytes("UTF-16LE");

            byte[] encData = encryptorAES.encrypt(_key,_message);
            String stringEnData = Base64.encodeToString(encData,Base64.DEFAULT);
            return stringEnData;
        }catch (Exception e){
            return null;
        }
    }



    /**
     * function used to decrypt a text string
     * @param secureText text ecrypted
     * @param key key
     *
     */
    public String decrypt(String secureText, String key)  {
        try {
            String result = encryptorAES.decrypt(key,
                    Base64.decode(secureText.getBytes(
                            "UTF-16LE"),
                            Base64.DEFAULT
                    ));

            return result;
        }catch (Exception e){
          return null;
        }
    }
}
