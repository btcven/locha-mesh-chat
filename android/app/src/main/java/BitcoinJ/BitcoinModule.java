package BitcoinJ;

import android.os.Build;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.bitcoinj.crypto.DeterministicKey;

import org.bitcoinj.wallet.Wallet;

import java.util.HashMap;

public class BitcoinModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;
    public static final String TAG = "Bitcoin_Module";
    private static final int ENTROPY_BITS = 128;
    private  boolean walletIscreated = false;
    Wallet wallet;
    CryptoLib cryptoLib;
    EncryptorAES encryptorAES;

    public BitcoinModule(@NonNull ReactApplicationContext context){
        reactContext = context;
        encryptorAES = new EncryptorAES();
        cryptoLib = new CryptoLib();
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
       String result = cryptoLib.generateMnemonic();

       if(result != null){
           promise.resolve(result);
       }else{
           promise.reject("Error", "something failed to the generate new Mnemonic");
       }
    }


    /**
     * create the wallet and return the private and public keys
     * @param mnemonic
     * @param promise ReactNative promise
     */
    @ReactMethod public void createWallet(String mnemonic, Promise promise){
        HashMap<String, String> keys = cryptoLib.createWallet(mnemonic);

        if(keys != null){
            WritableMap jsonKeys =  Arguments.createMap();
            jsonKeys.putString("privKey" ,keys.get("privKey"));
            jsonKeys.putString("pubKey", keys.get("pubKey"));

            promise.resolve(jsonKeys);
        }else{
            promise.reject("Error", "the wallet could not be created");
        }
    }

    /**
     *  used to get the privateKey once the wallet has already been created
     * @param promise ReactNative promise
     */
    @ReactMethod void getPrivateKey(Promise promise){
        String privKey = cryptoLib.getPrivateKey();
        if(privKey != null) {
            promise.resolve(privKey);
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
        String sha256Hash = cryptoLib.sha256(data);
        if(sha256Hash != null) {
            promise.resolve(sha256Hash.toString());
        } else {
            promise.reject("Error", "The sha256 could not be generated");
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
        String encryptData = cryptoLib.encrypt(message, key);

        if (encryptData != null) {
            promise.resolve(encryptData);
        } else {
            promise.reject("Error", "An error occurred while encrypting the text");
        }
    }

    /**
     * function used to decrypt a text string
     * @param secureText text ecrypted
     * @param key key
     * @param promise ReactNative promise
     */
    @ReactMethod public void decrypt(String secureText, String key, Promise promise )  {
        String decryptData = cryptoLib.decrypt(secureText , key);
        if (decryptData != null) {
             promise.resolve(decryptData);
        } else {
            promise.reject("Error", "an error occurred while trying to decrypt");
        }
    }

}
