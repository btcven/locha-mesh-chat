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

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Parcelable;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;

import androidx.annotation.Nullable;

import DeviceInfo.Utils;

/**
 * React Native interface to ChatService class.
 */
public class ChatServiceModule extends ReactContextBaseJavaModule {
    public ReactApplicationContext reactContext;
    private static final String TAG = "CHAT_SERVICE_MODULE";
    private ChatService service;
    private Intent intentService;
    private Promise mPromise;
    private static final int IMAGE_PICKER_REQUEST = 1;
    private BroadcastReceiver _bReceiver;
    private IntentFilter intentFilter;

    public static final String SERVICE_IS_STARTED = "com.lochameshchat.SERVICE_IS_STARTED";
    public static final String SERVICE_NOT_STARTED = "com.lochameshchat.SERVICE_NOT_STARTED";
    public static final String CLICK_FOREGRAUND_NOTIFICATION = "com.lochameshchat.CLICK_FOREGRAUND_NOTIFICATION";


    public ChatServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
//        this.service = ChatService.get();

         intentFilter = new IntentFilter();
         intentFilter.addAction(SERVICE_IS_STARTED);
         intentFilter.addAction(SERVICE_NOT_STARTED);
         intentFilter.addAction(CLICK_FOREGRAUND_NOTIFICATION);
         _bReceiver = bReceiver;

         reactContext.registerReceiver(_bReceiver, intentFilter);

        // eventReceiver class initialization
        EventReceivers.get(reactContext);


    }

    @Override
    public String getName() {
        return "ChatService";
    }

    /**
     * init service for maintaining live app in the background
     *
     * Android version >=  8 used ForegroundService
     *
     * @param privateKey Secp256k1 private key in hex, must be exactly 64
     * characters (32-bytes).
     */
    @ReactMethod
    public void start(String privateKey, Promise promise) {
        mPromise = promise;
        boolean isConnected = Utils.isConnected(reactContext);

        if(isConnected){
            intentService = new Intent(reactContext, ChatService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Log.i(TAG, "startForegroundService");
                intentService.putExtra("privateKey",  privateKey);
                reactContext.startForegroundService(intentService);
            }else{
                Log.i(TAG, "normal service");
                reactContext.startService(intentService);
            }
        }else{
            promise.reject("Error", "it's divice is not conected" );
        }

    }

//    @ReactMethod
//    public void stop() {
//        this.service.stop();
//    }
//
//    @ReactMethod
//    public boolean isStarted() {
//        return this.service.isStarted();
//    }

    /**
     * method used for get perrID and send it to React native
     * @param promise
     */
//    @ReactMethod
//    public void getPeerId(Promise promise) {
//        try {
//            promise.resolve(service.getPeerId());
//        } catch (Exception e) {
//            promise.reject(e);
//        }
//    }

//    @ReactMethod
//    public void dial(String multiaddr) {
//        this.service.dial(multiaddr);
//    }

//    @ReactMethod
//    public void sendMessage(String contents) {
//        try {
//            Log.i(TAG, "sendMessage: " + contents);
//            this.service.sendMessage(contents);
//        } catch (Exception e) {
//            Log.e(TAG, e.toString());
//        }
//    }


    /**
     * BroadcastReceiver is where we will be listening
     * to all the events returned by chatService
     *
     */
    private BroadcastReceiver bReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.i(TAG, "broadcast Receiver"+ intent.getAction());
            if(intent.getAction().equals(SERVICE_IS_STARTED)) {
                String peerID = intent.getStringExtra("peerID");
                mPromise.resolve(peerID);
                mPromise = null;
            }

            if (intent.getAction().equals(SERVICE_NOT_STARTED)){
                mPromise.reject("Error", "error starting service");
                mPromise= null;
            }
            
            if(intent.getAction().equals(CLICK_FOREGRAUND_NOTIFICATION)){
                try{
                    Intent _intent = new Intent();
                    _intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    Uri uri = Uri.fromParts("package", reactContext.getPackageName(), null);
                    _intent.setData(uri);
                    _intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.getApplicationContext().startActivity(_intent);
                } catch (Exception e){
                    Log.e(TAG, "onReceive: " + e.toString() );
                }


            }
        }
    };



}
