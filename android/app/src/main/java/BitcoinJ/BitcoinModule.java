package BitcoinJ;

import android.os.Build;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
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


//    @ReactMethod public void generateMnemonic(Promise promise){
//        NetworkParameters params = TestNet3Params.get();
//
//        wallet =  new Wallet(params);
//        DeterministicKey key = wallet.getWatchingKey();
//
//        DeterministicSeed seed = wallet.getKeyChainSeed();
//
//        Log.i(TAG, "pubKey:"+ key.getPublicKeyAsHex());
//        Log.i(TAG, "prvKey" + key.getPrivateKeyAsHex());
//
//        promise.resolve( Joiner.on(" ").join(seed.getMnemonicCode()));
//
//    }


    @ReactMethod public void createWallet(String mnemonic , Promise promise){
        NetworkParameters params = TestNet3Params.get();
        List<String> list = new ArrayList<String>();

        list.addAll(Arrays.asList(mnemonic.split(" ")));
        DeterministicSeed seed = new DeterministicSeed(list, null, "", System.currentTimeMillis());

         wallet = Wallet.fromSeed(
                params,
                seed
        );


        DeterministicKeyChain deterministicKeyChain = wallet.getActiveKeyChain();
        DeterministicKey account = deterministicKeyChain.getWatchingKey();

        Log.i(TAG, "private: " + account.getPrivateKeyAsHex());
        Log.i(TAG, "public: " + account.getPublicKeyAsHex());

    }


    @ReactMethod void getPrivateKey(Promise promise){
        DeterministicKey key = wallet.getWatchingKey();
         byte[] xpriv = key.getPrivKeyBytes();

         promise.resolve(xpriv);
    }



    @ReactMethod void getPublicKey(Promise promise){
        DeterministicKey key = wallet.getWatchingKey();
        byte[] xpubkey = key.getPubKey();

        promise.resolve(xpubkey);
    }


    @ReactMethod public void RestoreWallet () {

    }

}
