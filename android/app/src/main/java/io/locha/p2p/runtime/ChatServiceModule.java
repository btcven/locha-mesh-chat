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

import android.util.Log;

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
public class ChatServiceModule extends ReactContextBaseJavaModule implements ChatServiceEvents {
    public ReactApplicationContext reactContext;
    ChatService service;
    private static final String TAG = "CHAT_SERVICE_MODULE";

    public ChatServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        service = ChatService.get();
    }

    @Override
    public String getName() {
        return "ChatService";
    }

    /**
     * @param privateKey Secp256k1 private key in hex, must be exactly 64
     * characters (32-bytes).
     */
    @ReactMethod
    public void start(String privateKey) {
        byte[] privateKeyBytes = Utils.hexStringToByteArray(privateKey);
        service.setEventsHandler(this);
        service.start(privateKeyBytes);
    }

    @ReactMethod
    public void stop() {
        service.stop();
    }

    @ReactMethod
    public void dial(String multiaddr) {
        service.dial(multiaddr);
    }

    @ReactMethod
    public void sendMessage(String contents) {
        Log.i(TAG, "sendMessage: "+ contents);
        service.sendMessage(contents);
    }

    @Override
    public void onNewMessage(String contents) {
        WritableMap params = Arguments.createMap();
        params.putString("contents", contents);
        sendEvent(this.reactContext, "newMessage", params);
    }

    @Override
    public void onNewListenAddr(String multiaddr) {
        WritableMap params = Arguments.createMap();
        params.putString("multiaddr", multiaddr);
        sendEvent(this.reactContext, "newListenAddr", params);
    }

    private static void sendEvent(ReactContext reactContext,
                                  String eventName,
                                  @Nullable WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

}
