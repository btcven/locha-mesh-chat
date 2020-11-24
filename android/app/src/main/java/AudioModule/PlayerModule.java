package AudioModule;


import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Map;

import BitcoinJ.CryptoLib;

public class PlayerModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context;
    private final static String TAG = "PlayerModule";
    Map<String, Player> playerMap = new HashMap<>();

    private Promise handlePromise = null;

    public PlayerModule(ReactApplicationContext reactContext){
        context = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "PlayerModule";
    }


    @ReactMethod public void prepare(String fileName, Promise promise) {
        CryptoLib cryptoLib = new CryptoLib();
        String keyPlayer = cryptoLib.sha256(fileName);
        Player player;

        player = playerMap.get(keyPlayer);
        if(player == null){
            player = new Player(context, fileName , keyPlayer ,promise);
            playerMap.put(keyPlayer, player);
            return;
        }

        WritableMap json = player.getSoundData();
        promise.resolve(json);

    }
}
