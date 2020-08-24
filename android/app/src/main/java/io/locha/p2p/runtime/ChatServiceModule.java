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

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;

import androidx.annotation.Nullable;

/**
 * React Native interface to ChatService class.
 */
public class ChatServiceModule extends ReactContextBaseJavaModule implements ChatServiceEvents {
    public ReactApplicationContext reactContext;

    public ChatServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
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
        ChatService service = ChatService.get();
        service.setEventsHandler(this);

        byte[] privateKeyBytes = hexStringToByteArray(privateKey);
        service.start(privateKeyBytes);
    }

    @ReactMethod
    public void stop() {
        ChatService service = ChatService.get();
        service.stop();
    }

    @ReactMethod
    public boolean isStarted() {
        ChatService service = ChatService.get();
        return service.isStarted();
    }

    @ReactMethod
    public String getPeerId() {
        ChatService service = ChatService.get();
        return service.getPeerId();
    }

    @ReactMethod
    public void dial(String multiaddr) {
        ChatService service = ChatService.get();
        service.dial(multiaddr);
    }

    @ReactMethod
    public void sendMessage(String contents) {
        ChatService service =  ChatService.get();
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

    /**
     * @see https://stackoverflow.com/questions/140131/convert-a-string-representation-of-a-hex-dump-to-a-byte-array-using-java
     */
    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte)((Character.digit(s.charAt(i), 16) << 4)
                                + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
}
