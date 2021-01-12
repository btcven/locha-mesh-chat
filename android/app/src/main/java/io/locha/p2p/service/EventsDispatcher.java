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

package io.locha.p2p.service;

import DeviceInfo.Utils;
import io.locha.p2p.runtime.RuntimeEvents;

import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;

import org.json.JSONObject;

public class EventsDispatcher implements RuntimeEvents {
    private static final String TAG = "EventsReceiver";
    private static EventsDispatcher INSTANCE = null;
    private ReactApplicationContext reactContext;

    private EventsDispatcher() { }

    /**
     * Function returns class instance it, doesn't needs parameters.
     *
     * @return EventsDispatcher instance.
     */
    public static EventsDispatcher getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new EventsDispatcher();
        }

        return INSTANCE;
    }

    /**
     * Set the ReactApplicationContext for this object.
     */
    public  void setApplicationContext(ReactApplicationContext context) {
        this.reactContext = context;
    }

    @Override public void onNewMessage(String peerId, String contents) {
        try {
            JSONObject obj = new JSONObject(contents);
            if(obj.getString("fromUID" ) == null){
                obj.put("fromUID", peerId);
            }

            sendEvent(this.reactContext, "newMessage", obj.toString());
            Log.d(TAG, "newMessage" + obj);
        } catch (Exception err) {
            Log.e(TAG, " something failed trying parse the message JSON:", err );
        }

    }

    @Override public void onConnectionEstablished(String peer, int numEstablished) {
        Log.d(TAG, String.format("connectionEstablished: peer=%s numEstablished=%d", peer, numEstablished));
        WritableMap map = Arguments.createMap();
        map.putString("peer", peer);
        map.putInt("numEstablished", numEstablished);
        sendEvent(this.reactContext, "connectionEstablished", map);
    }

    @Override public void onConnectionClosed(String peer, int numEstablished, String cause) {
        Log.d(TAG, String.format("connectionClosed: peer=%s numEstablished=%d, cause=%s", peer,
                                 numEstablished, cause));
        WritableMap map = Arguments.createMap();
        map.putString("peer", peer);
        map.putInt("numEstablished", numEstablished);
        map.putString("cause", cause);
        sendEvent(this.reactContext, "connectionClosed", map);
    }

    @Override public void onIncomingConnection(String localAddr, String sendBackAddr) {
        Log.d(TAG, String.format("incomingConnection: localAddr=%s sendBackAddr=%s", localAddr, sendBackAddr));
        WritableMap map = Arguments.createMap();
        map.putString("localAddr", localAddr);
        map.putString("sendBackAddr", sendBackAddr);
        sendEvent(this.reactContext, "incomingConnection", map);
    }

    @Override public void onIncomingConnectionError(String localAddr, String sendBackAddr, String error) {
        Log.d(TAG, String.format("incomingConnectionError: localAddr=%s, sendBackAddr=%s, error=%s",
                                 localAddr, sendBackAddr, error));
        WritableMap map = Arguments.createMap();
        map.putString("localAddr", localAddr);
        map.putString("sendBackAddr", sendBackAddr);
        map.putString("error", error);
        sendEvent(this.reactContext, "incomingConnectionError", map);
    }

    @Override public void onBannedPeer(String peer) {
        Log.d(TAG, String.format("bannedPeer: peer=%s", peer));
        sendEvent(this.reactContext, "bannedPeer", peer);
    }

    @Override public void onUnreachableAddr(String peer,
                                            String address,
                                            String error,
                                            int attemptsRemaining) {
        Log.d(TAG, String.format("unreachableAddr: peer=%s address=%s error=\"%s\" attemptsRemaining=%d",
                                 peer, address, error, attemptsRemaining));
        WritableMap map = Arguments.createMap();
        map.putString("peer", peer);
        map.putString("address", address);
        map.putString("error", error);
        map.putInt("attemptsRemaining", attemptsRemaining);
        sendEvent(this.reactContext, "unreachableAddr", map);
    }

    @Override public void onUnknownPeerUnreachableAddr(String address, String error) {
        Log.d(TAG, String.format("unknownPeerUnreachableAddr: address=%s error=\"%s\"", address, error));
        WritableMap map = Arguments.createMap();
        map.putString("address", address);
        map.putString("error", error);
        sendEvent(this.reactContext, "unknownPeerUnreachableAddr", map);
    }

    @Override public void onNewListenAddr(String multiaddr) {
        Log.d(TAG, String.format("newListenAddr: multiaddr=%s", multiaddr));
        sendEvent(this.reactContext, "newListenAddr", multiaddr);
    }

    @Override public void onExpiredListenAddr(String address) {
        Log.d(TAG, String.format("expiredListenAddr: address=%s", address));
        sendEvent(this.reactContext, "expiredListenAddr", address);
    }

    @Override public void onListenerClosed(String[] addresses) {
        Log.d(TAG, "listenerClosed");
        WritableMap map = Arguments.createMap();
        map.putArray("addresses", Arguments.fromArray(addresses));
        sendEvent(this.reactContext, "listenerClosed", map);
    }

    @Override public void onListenerError(String error) {
        Log.d(TAG, String.format("listenerError: error=%s", error));
        sendEvent(this.reactContext, "listenerError", error);
    }

    @Override public void onDialing(String peer) {
        Log.d(TAG, String.format("dialing: peer=%s", peer));
        sendEvent(this.reactContext, "dialing", peer);
    }


    public void onExternalAddress(String address){
        sendEvent(reactContext, "externalAddress" , address);
    }


    public void isConnected(boolean isConnected) {
        sendEvent(reactContext, "isConnect" , isConnected );
    }

    public void connectionChanged(boolean isConnected){
        sendEvent(reactContext, "ConnectionChanged" , isConnected );
    }

    /**
     * Sends the given event to React Native
     *
     * This function is overloaded, it will send an String as parameter
     *
     * @param reactContext Context activity
     * @param eventName Event name
     * @param param Parameter to send
     */
    private static void sendEvent(@NonNull ReactContext reactContext,
                                  String eventName,
                                  @Nullable String param) {
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, param);
        }catch (Exception e){
            Log.e(TAG, "fail event because: ", e);
        }
    }


    /**
     * Sends the given event to React Native
     *
     * This function is overloaded, it will send a WritableMap as parameter
     *
     * @param reactContext Context activity
     * @param eventName Event name
     * @param params Parameters to send
     */
    private static void sendEvent(@NonNull ReactContext reactContext,
                                  String eventName,
                                  @Nullable WritableMap params) {
        try {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }catch (Exception e){
            Log.e(TAG, "Fail event because: ", e);
        }
    }

    /**
     * Sends the given event to React Native
     *
     * This function is overloaded, it will send a WritableMap as parameter
     *
     * @param reactContext Context activity
     * @param eventName Event name
     * @param params Parameters to send
     */
    private static void sendEvent(@NonNull ReactContext reactContext,
                                  String eventName,
                                  @Nullable boolean params) {
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }catch (Exception e){
            Log.e(TAG, "Fail event because: ", e);
        }
    }
}
