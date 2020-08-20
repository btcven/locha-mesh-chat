package BitcoinJ;

import android.os.Build;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.common.base.Joiner;

import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.core.Sha256Hash;
import org.bitcoinj.core.Utils;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.crypto.MnemonicCode;
import org.bitcoinj.crypto.MnemonicException;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.params.TestNet3Params;
import org.bitcoinj.script.Script;
import org.bitcoinj.wallet.DeterministicKeyChain;
import org.bitcoinj.wallet.DeterministicSeed;
import org.bitcoinj.wallet.DeterministicSeed;
import org.bitcoinj.wallet.Wallet;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.InvalidParameterSpecException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;


public class BitcoinModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;
    public static final String TAG = "Bitcoin_Module";
    private static final int ENTROPY_BITS = 128;
    private  boolean walletIscreated = false;
    Wallet wallet;

    EncryptorAES encryptorAES;

    public BitcoinModule(@NonNull ReactApplicationContext context){
        reactContext = context;
        encryptorAES = new EncryptorAES();
    }


    @NonNull
    @Override
    public String getName() {
        return "bitcoinModule";
    }

    /**
     * this function generates the words used when creating the wallet
     * @param promise
     */
    @ReactMethod public void generateMnemonic(Promise promise)  {
        try {
            int entropyLen = ENTROPY_BITS / 8;
            byte[] entropy = generateEntropy(entropyLen);
            List<String> words = null;
            words = MnemonicCode.INSTANCE.toMnemonic(entropy);
            String mnemonic = Joiner.on(" ").join(words);

            promise.resolve(mnemonic);
        } catch (MnemonicException.MnemonicLengthException e) {
           promise.reject("Error", e.toString());
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
     * @param promise ReactNative promise
     */
    @ReactMethod public void createWallet(String mnemonic , Promise promise){
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


        WritableMap map = Arguments.createMap();
        map.putString("privKey" ,account.getPrivateKeyAsHex());
        map.putString("pubKey", account.getPublicKeyAsHex());

        promise.resolve(map);

    }

    /**
     *  used to get the privateKey once the wallet has already been created
     * @param promise ReactNative promise
     */
    @ReactMethod void getPrivateKey(Promise promise){
        if(walletIscreated) {
            DeterministicKey key = wallet.getWatchingKey();
            String xpriv = key.getPrivateKeyAsHex();
            promise.resolve(xpriv);
        }else{
           promise.reject("Error", "wallet don't created" );
        }
    }


    /**
     * used to get the publickey once the wallet has already been created
     * @param promise ReactNative promise
     */
    @ReactMethod void getPublicKey(Promise promise){
        if(walletIscreated) {
            DeterministicKey key = wallet.getWatchingKey();
            String xpubkey = key.getPublicKeyAsHex();

            promise.resolve(xpubkey);
        }else{
            promise.reject("Error", "wallet don't created" );
        }
    }


    /**
     *  function converts strings from string to sha256 format
     * @param data text to convert
     * @param promise ReactNative promise
     */
    @ReactMethod public void sha256(String data, Promise promise){
        try {
            byte[] b = data.getBytes();

            Sha256Hash sha256Hash =  Sha256Hash.of(b);

            Log.i(TAG, "sha256"+  sha256Hash.toString());

            promise.resolve(sha256Hash.toString());
        } catch (Exception e){
            promise.reject("Error", e.toString());
        }

    }

    /**
     * function used to encrypt a text string
     *
     * @param message  text to encrypt
     * @param key  key
     * @param promise ReactNative promise
     */
    @ReactMethod public void encrypt(String message, String key, Promise promise)  {
    try{
        byte[] _message  = message.getBytes("UTF-16LE");
        byte [] _key = key.getBytes("UTF-16LE");

        byte[] encData = encryptorAES.encrypt(_key,_message);
        String stringEnData = Base64.encodeToString(encData,Base64.DEFAULT);
        promise.resolve(stringEnData);
    }catch (Exception e){
        promise.reject("Error", e.toString());
    }


    }

    /**
     * function used to decrypt a text string
     * @param secureText text ecrypted
     * @param key key
     * @param promise ReactNative promise
     */
    @ReactMethod public void decrypt(String secureText, String key, Promise promise )  {
        try {
            String result = encryptorAES.decrypt(key,
                    Base64.decode(secureText.getBytes(
                            "UTF-16LE"),
                            Base64.DEFAULT
                    ));

            promise.resolve(result);
        }catch (Exception e){
            promise.reject("Error", e.toString());
        }
    }

}
