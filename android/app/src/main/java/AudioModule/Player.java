package AudioModule;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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
                Log.e(TAG, "createMediaPlayer failed", e);
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

    public void play(Promise promise) {
        if(mediaPlayer == null){
            promise.reject("Error", "Player is null");
            return;
        }

        if(mediaPlayer.isPlaying()){
            promise.reject("Error", "Media player is already running");
            return;
        }

        handlerPromise = promise;
        mediaPlayer.setOnCompletionListener(mCompletionListener);

        mediaPlayer.start();

    }

    private MediaPlayer.OnCompletionListener mCompletionListener = new MediaPlayer.OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mediaPlayer) {
            if(!mediaPlayer.isLooping()){
                Log.i(TAG, "onCompletion listener");
                if(handlerPromise != null){
                    handlerPromise.resolve(true);
                    handlerPromise = null;
                }
            }
        }
    };

    private MediaPlayer.OnErrorListener merrorListener = new MediaPlayer.OnErrorListener() {
        @Override
        public boolean onError(MediaPlayer mediaPlayer, int i, int i1) {
            Log.e(TAG, "onError: ");

            return false;
        };
    };

    public WritableMap getCurrentTime(){

        WritableMap json = Arguments.createMap();
        json.putDouble("seconds",  mediaPlayer.getCurrentPosition() * .001);
        json.putBoolean("isPlaying", mediaPlayer.isPlaying());

        return json;
    }

    public void setCurrentTime(float sec){
        if(mediaPlayer != null){
            mediaPlayer.seekTo((int)Math.round(sec * 1000));
        }
    }

    public void pause(Promise promise){
       if(mediaPlayer != null && mediaPlayer.isPlaying() ) {
           try{
               mediaPlayer.pause();
               promise.resolve(true);
               return;
           } catch (Exception e) {
               promise.reject("error", e);
               Log.e(TAG, "Pause: ", e);
           }
       }
    }

   public void release(){
      mediaPlayer.reset();
      mediaPlayer.release();
      mediaPlayer = null;
   }

    @Override
    public void onPrepared(MediaPlayer mediaPlayer) {
        WritableMap json = getSoundData();
        prepare= true;
        handlerPromise.resolve(json);
        handlerPromise = null;
    }
}
