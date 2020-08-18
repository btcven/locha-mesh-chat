package BitcoinJ;

import android.os.Build;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.common.base.Joiner;

import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
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

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class BitcoinModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;
    public static final String TAG = "Bitcoin_Module";
    private static final int ENTROPY_BITS = 128;
    private  boolean walletIscreated = false;
    Wallet wallet;

    public BitcoinModule(@NonNull ReactApplicationContext context){
        reactContext = context;
    }


    @NonNull
    @Override
    public String getName() {
        return "bitcoinModule";
    }


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

    private static byte[] generateEntropy(int entropyLen) {
        byte[] entropy = new byte[entropyLen];
        SecureRandom random = new SecureRandom();
        random.nextBytes(entropy);
        return entropy;
    }



    @ReactMethod public void createWallet(String mnemonic , Promise promise){
        NetworkParameters params = TestNet3Params.get();
        List<String> list = new ArrayList<String>();

        list.addAll(Arrays.asList(mnemonic.split(" ")));
        DeterministicSeed seed = new DeterministicSeed(list, null, "", System.currentTimeMillis());

         wallet = Wallet.fromSeed(
                params,
                seed
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


    @ReactMethod void getPrivateKey(Promise promise){
        if(walletIscreated) {
            DeterministicKey key = wallet.getWatchingKey();
            String xpriv = key.getPrivateKeyAsHex();
            promise.resolve(xpriv);
        }else{
           promise.reject("Error", "wallet don't created" );
        }
    }



    @ReactMethod void getPublicKey(Promise promise){
        if(walletIscreated) {
            DeterministicKey key = wallet.getWatchingKey();
            String xpubkey = key.getPublicKeyAsHex();

            promise.resolve(xpubkey);
        }else{
            promise.reject("Error", "wallet don't created" );
        }
    }


}
