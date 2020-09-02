/*
 * Copyright 2020 Locha Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.locha.p2p.runtime;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import DeviceInfo.Utils;
import io.locha.p2p.util.LibraryLoader;

/**
 * React Native interface to ChatService class.
 */
public class ChatServiceModule extends ReactContextBaseJavaModule {
    public ReactApplicationContext reactContext;
    private static final String TAG = "CHAT_SERVICE_MODULE";
    private ChatService service;
    private Intent intentService;
    private Promise mPromise;
    private BroadcastReceiver _bReceiver;
    private IntentFilter intentFilter;

    public static final String SERVICE_IS_STARTED = "com.lochameshchat.SERVICE_IS_STARTED";
    public static final String SERVICE_NOT_STARTED = "com.lochameshchat.SERVICE_NOT_STARTED";
    public static final String CLICK_FOREGROUND_NOTIFICATION = "com.lochameshchat.CLICK_FOREGROUND_NOTIFICATION";
    private String peerID = null;

    public ChatServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        LibraryLoader.load();

         intentFilter = new IntentFilter();
         intentFilter.addAction(SERVICE_IS_STARTED);
         intentFilter.addAction(SERVICE_NOT_STARTED);
         intentFilter.addAction(CLICK_FOREGROUND_NOTIFICATION);
         _bReceiver = bReceiver;

         reactContext.registerReceiver(_bReceiver, intentFilter);

        // EventsReceiver class initialization
        EventsReceiver.init(reactContext);
    }

    /**
     * @return Module name.
     */
    @Override
    @NonNull
    public String getName() {
        return "ChatService";
    }

    /**
     * Initialize service for maintaining the app alive in the background
     *
     * Android Version >=8.0 used ForegroundService
     *
     * @param privateKey secp256k1 private key in hex, must be exactly 64
     * characters (32-bytes).
     */
    @ReactMethod
    public void start(String privateKey, Promise promise) {
        mPromise = promise;
        boolean isConnected = Utils.isConnected(reactContext);

        if (isConnected) {
            intentService = new Intent(reactContext, ChatService.class);
            // Guard for Android >=8.0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Log.i(TAG, "starting foreground service");
                intentService.putExtra("privateKey",  privateKey);
                reactContext.startForegroundService(intentService);
            } else {
                Log.i(TAG, "starting normal service");
                reactContext.startService(intentService);
            }
        } else {
            promise.reject("Error", "the device is not connected");
        }
    }

    /**
     * Stop the service
     */
    @ReactMethod public void stop() {
        try{
            reactContext.stopService(intentService);
            reactContext.unregisterReceiver(_bReceiver);
        } catch (Exception e){
            Log.e(TAG, "Couldn't stop service", e);
        }
    }

    @ReactMethod public void isStarted(Promise promise) {
        try {
            promise.resolve(nativeIsStarted());
        } catch (Exception e) {
            Log.e(TAG, "Couldn't check if runtime has started", e);
        }
    }

    /**
     * method used for get perrID and send it to React native
     * @param promise
     */
    @ReactMethod
    public void getPeerId(Promise promise) {
        if (peerID == null) {
            promise.reject("Error", "peerID is null");
        } else {
            promise.resolve(peerID);
        }
    }

    /**
     * Dial (connect to) a peer.
     *
     * @param multiaddr The peer address in Multiaddress format.
     *
     * @throws RuntimeException if the address is invalid.
     *
     * @see <a href="https://multiformats.io/multiaddr/">Multiaddr</a>
     */
    @ReactMethod public void dial(String multiaddr) {
        try {
            nativeDial(multiaddr);
        } catch (Exception e){
            Log.e(TAG, "Couldn't dial address", e);
        }

    }

    /**
     * Send a message
     *
     * @param contents The message contents.
     */
    @ReactMethod public void sendMessage(String contents) {
        Log.d(TAG, "sendMessage");

        try {
            nativeSendMessage(contents);
        } catch (Exception e) {
            Log.e(TAG, "Couldn't send message", e);
        }
    }

    /**
     * BroadcastReceiver is where we will be listening
     * to all the events returned by chatService
     *
     */
    private BroadcastReceiver bReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "broadcast Receiver" + intent.getAction());

            if (intent.getAction().equals(SERVICE_IS_STARTED)) {
                String _peerID = intent.getStringExtra("peerID");
                peerID = _peerID;
                mPromise.resolve(_peerID);
                mPromise = null;
            }

            if (intent.getAction().equals(SERVICE_NOT_STARTED)) {
                mPromise.reject("Error", "error starting service");
                mPromise= null;
            }

            if (intent.getAction().equals(CLICK_FOREGROUND_NOTIFICATION)){
                try {
                    Intent _intent = new Intent();
                    _intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    Uri uri = Uri.fromParts("package", reactContext.getPackageName(), null);
                    _intent.setData(uri);
                    _intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.getApplicationContext().startActivity(_intent);
                } catch (Exception e) {
                    Log.e(TAG, "Error", e);
                }
            }
        }
    };

    public boolean checkServiceRunning(Class<?> serviceClass){
        ActivityManager manager = (ActivityManager) reactContext.getSystemService(reactContext.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE))
        {
            if (serviceClass.getName().equals(service.service.getClassName()))
            {
                return true;
            }
        }
        return false;
    }

    public native boolean nativeIsStarted();
    public native void nativeDial(String multiaddr);
    public native void nativeSendMessage(String contents);

}
