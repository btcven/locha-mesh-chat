package AudioModule;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

import java.io.File;

import BitcoinJ.CryptoLib;

public class Player  implements  MediaPlayer.OnPreparedListener {

    Context context;
    private final static String TAG = "Player";
    private String filePath;
    private MediaPlayer mediaPlayer;
    private Promise handlerPromise;
    private String playerKey;
    private Boolean prepare = true;

    public Player(Context reactContext, String path, String key, Promise promise) {
        context = reactContext;
        filePath = path;
        handlerPromise = promise;
        playerKey = key;
        this.prepared();
    }



    private void prepared(){
        if(filePath != null){
             mediaPlayer =  createMediaPlayer(filePath);

             if (mediaPlayer == null) {
                handlerPromise.reject(
                        "Error",
                        "File not found"
                );
             }

            Log.i(TAG, "before prepared");
            mediaPlayer.setOnPreparedListener(this);
            mediaPlayer.prepareAsync();
        } else {
            handlerPromise.reject(
                    "Error",
                    "File is null"
            );
        }
    }

    private MediaPlayer createMediaPlayer(String filePath){

        MediaPlayer mediaPlayer = new MediaPlayer();
        mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);

        File file = new File(filePath);

        if (file.exists()) {
            try {
                mediaPlayer.setDataSource(filePath);
                return mediaPlayer;
            } catch (Exception e) {

            }
        } else {
            Log.e(TAG, "createMediaPlayer: file does not exist" );
            return null;
        }

        return null;
    }


    public WritableMap getSoundData() {
        WritableMap json = Arguments.createMap();
        json.putDouble("duration", mediaPlayer.getDuration() * .001);
        json.putString("key", playerKey);
        json.putBoolean("prepared", prepare);

        return json;
    }


    @Override
    public void onPrepared(MediaPlayer mediaPlayer) {
        WritableMap json = getSoundData();
        prepare= true;
        handlerPromise.resolve(json);
    }
}
