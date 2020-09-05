package io.locha.p2p.runtime;

import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;

public class EventsReceiver implements ChatServiceEvents {
    ReactApplicationContext reactContext;

    private static EventsReceiver INSTANCE = null;
    private static final String TAG = "EventsReceiver";

    private EventsReceiver(ReactApplicationContext context) {
        reactContext = context;
    }

    /**
     * Get instance of the EventReceivers.
     */
    public static EventsReceiver init(ReactApplicationContext context) {
        if (INSTANCE == null) {
            INSTANCE = new EventsReceiver(context);
        }

        return INSTANCE;
    }

    /**
     * Function returns class instance it, doesn't needs parameters.
     *
     * @return EventsReceiver instance.
     */
    public static EventsReceiver get() {
        return INSTANCE;
    }

    @Override public void onNewMessage(String contents) {
        Log.d(TAG, "newMessage");
        sendEvent(this.reactContext, "newMessage", contents);
    }

    @Override public void onPeerDiscovered(String peer, String[] addrs) {
        Log.d(TAG, String.format("peerDiscovered: %s", peer));
        WritableMap map = Arguments.createMap();
        map.putString("peer", peer);
        map.putArray("addresses", Arguments.fromArray(addrs));
        sendEvent(this.reactContext, "peerDiscovered", map);
    }

    @Override public void onPeerUnroutable(String peer) {
        Log.d(TAG, String.format("peerUnroutable: %s", peer));
        sendEvent(this.reactContext, "peerUnroutable", peer);
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
        Log.d(TAG, String.format("incomingConnection Error: localAddr=%s, sendBackAddr=%s, error=%s",
                                 localAddr, sendBackAddr, error));
        WritableMap map = Arguments.createMap();
        map.putString("localAddr", localAddr);
        map.putString("sendBackAddr", sendBackAddr);
        map.putString("error", error);
        sendEvent(this.reactContext, "incomingConnectionError", map);
    }

    @Override public void onBannedPeer(String peer) {
        Log.d(TAG, String.format("bannedPeer: peer=%s"));
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
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, param);
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
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
