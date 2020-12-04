package AudioModule;


import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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


    @ReactMethod public void play(String key ,Promise promise ) {

        Log.i(TAG, "play: dios" + key );

        Player player = playerMap.get(key);

        if(player == null){
            promise.reject("Error", "player not found");
            return;
        }

        player.play(promise);
    }


    @ReactMethod
    public void getCurrentTime(String  key, final Callback callback) {
        Player player = playerMap.get(key);
        if (player == null) {
            WritableMap json = Arguments.createMap();
            json.putDouble("seconds",-1);
            json.putBoolean("isPlaying", false);
            callback.invoke(json);
            return;
        }

        callback.invoke(player.getCurrentTime());
    }


    @ReactMethod
    public void pause(String key, final Promise promise) {
        Player player = playerMap.get(key);
        if(player == null) {
            promise.reject("Error", "player not found");
            return;
        }

        player.pause(promise);

    }

    @ReactMethod public void setCurrentTime(String key, float sec){
        Player player = playerMap.get(key);

        if(player != null){
            player.setCurrentTime(sec);
        }
    }


    @ReactMethod
    public void release(String key) {
        Player player = playerMap.get(key);
        if (player != null) {
             player.release();
            playerMap.remove(key);
            return;
        }
    }

}
