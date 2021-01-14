package AudioModule;

import android.media.MediaRecorder;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import android.util.Base64;
import java.util.Timer;
import java.util.TimerTask;

public class SoundModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;
    private MediaRecorder recorder;
    private final static String TAG = "SoundModule";
    private Boolean isRecording = false;
    private Chronometer chronometer;
    private Timer timer;
    private String recorderPath;

    public SoundModule(ReactApplicationContext reactContext) {
        context = reactContext;
        chronometer = new Chronometer();

    }

    @NonNull
    @Override
    public String getName() {
        return "SoundMdoule";
    }


    private int getAudioEncoderFromString(String audioEncoder) {
        switch (audioEncoder) {
            case "aac":
                return MediaRecorder.AudioEncoder.AAC;
            case "aac_eld":
                return MediaRecorder.AudioEncoder.AAC_ELD;
            case "amr_nb":
                return MediaRecorder.AudioEncoder.AMR_NB;
            case "amr_wb":
                return MediaRecorder.AudioEncoder.AMR_WB;
            case "he_aac":
                return MediaRecorder.AudioEncoder.HE_AAC;
            case "vorbis":
                return MediaRecorder.AudioEncoder.VORBIS;
            default:
                Log.d("INVALID_AUDIO_ENCODER", "USING MediaRecorder.AudioEncoder.DEFAULT instead of " + audioEncoder + ": " + MediaRecorder.AudioEncoder.DEFAULT);
                return MediaRecorder.AudioEncoder.DEFAULT;
        }
    }

    private int getOutputFormatFromString(String outputFormat) {
        switch (outputFormat) {
            case "mpeg_4":
                return MediaRecorder.OutputFormat.MPEG_4;
            case "aac_adts":
                return MediaRecorder.OutputFormat.AAC_ADTS;
            case "amr_nb":
                return MediaRecorder.OutputFormat.AMR_NB;
            case "amr_wb":
                return MediaRecorder.OutputFormat.AMR_WB;
            case "three_gpp":
                return MediaRecorder.OutputFormat.THREE_GPP;
            case "webm":
                return MediaRecorder.OutputFormat.WEBM;
            default:
                Log.d("INVALID_OUPUT_FORMAT", "USING MediaRecorder.OutputFormat.DEFAULT : " + MediaRecorder.OutputFormat.DEFAULT);
                return MediaRecorder.OutputFormat.DEFAULT;

        }
    }

    @ReactMethod
    public void prepareRecoder(ReadableMap recordingSettings, Promise promise) {

        Log.i(TAG, "prepareRecoder: " + recordingSettings.toString());
        try {
        File destFile = new File(recordingSettings.getString("path"));
        if (destFile.getParentFile() != null) {
            destFile.getParentFile().mkdirs();
        }
        recorder = new MediaRecorder();
        recorder.setAudioSource(recordingSettings.getInt("AudioSource"));
        int outputFormat = getOutputFormatFromString(recordingSettings.getString("OutputFormat"));
        recorder.setOutputFormat(outputFormat);
        int audioEncoder = getAudioEncoderFromString(recordingSettings.getString("AudioEncoding"));
        recorder.setAudioEncoder(audioEncoder);
        recorder.setAudioSamplingRate(recordingSettings.getInt("SampleRate"));
        recorder.setAudioChannels(recordingSettings.getInt("Channels"));
        recorder.setAudioEncodingBitRate(recordingSettings.getInt("AudioEncodingBitRate"));
        recorder.setOutputFile(recordingSettings.getString("path"));

        recorderPath = recordingSettings.getString("path");

        recorder.prepare();
        promise.resolve(null);
        } catch (Exception e) {
            Log.e(TAG, "prepareRecoder: ", e);
            promise.reject("Error", e);
        }

    }

    @ReactMethod public void startRecording (Promise promise){
        if(isRecording){
             promise.reject("Error",  "the recording has already started");
            return;
        }

        if(recorder == null){
            promise.reject("Error",  "it have not initializated");
        }


        Log.i(TAG, "startRecording:");
        try {
            chronometer.reset();
            chronometer.start();
            recorder.start();
            startTimer();
        } catch (Exception err ) {
            Log.e(TAG, "startRecording: ", err);
        }

    }

    @ReactMethod public void stopRecording (){
        try {
            Log.i(TAG, "stopRecording: ");

            recorder.stop();
            recorder.release();
            chronometer.stop();
            stopTimer();
            onFinished();
        } catch (Exception e) {
            Log.e(TAG, "stopRecording: ", e );
        }
    }

    private void startTimer(){
        timer = new Timer();

        timer.schedule( new TimerTask() {
            public void run() {
                sendEvent("onProgress", chronometer.getTimeSeconds());
            }
        }, 0, 1000);

    }

    private void stopTimer(){
        if (timer != null) {
            timer.cancel();
            timer.purge();
            timer = null;
        }
    }

    private void onFinished(){
        try {
            InputStream inputStream = new FileInputStream(recorderPath);
            byte[] bytes;
            byte[] buffer = new byte[8192];
            int bytesRead;
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            try {
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
            } catch (IOException e) {
                Log.e(TAG, "FAILED TO PARSE FILE");
            }
            bytes = output.toByteArray();
            String base64 = Base64.encodeToString(bytes, Base64.NO_WRAP);

            WritableMap object = Arguments.createMap();

            object.putString("file",base64 );
            object.putString("path", recorderPath);

            Log.i(TAG, "onFinished: "+ base64);
            sendEvent("onFinished", object);

        } catch (FileNotFoundException e) {
            Log.e(TAG, "FAILED TO FIND FILE");
        }
    }

    private  void sendEvent(String eventName, @NonNull Float params ) {
        try {
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } catch (Exception e){
            Log.e(TAG, "Fail event because: ", e);
        }
    }

    private  void sendEvent(String eventName, @NonNull WritableMap params ) {
        try {
            Log.i(TAG, "sendEvent: " + eventName);
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } catch (Exception e){
            Log.e(TAG, "Fail event because: ", e);
        }
    }
}
