package io.locha.p2p.runtime;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class EventReceivers implements ChatServiceEvents {
    ReactApplicationContext reactContext;
    private static EventReceivers INSTANCE = null;


    private EventReceivers(ReactApplicationContext context){
        reactContext = context;
    }


    /**
     * Get instance of the EventReceivers.
     */
    public static EventReceivers get(ReactApplicationContext context) {
        if (INSTANCE == null) {
            INSTANCE = new EventReceivers(context);
        }

        return INSTANCE;
    }

    /**
     *  function returns class instance it, don't need to parameters.
     *
     * @return EventReceivers
     */
    public static EventReceivers get() {
        if (INSTANCE == null) {
            return null;
        }
        return INSTANCE;
    }

    @Override
    public void onNewMessage(String contents) {
        sendEvent(this.reactContext, "newMessage", contents);
    }

    @Override
    public void onNewListenAddr(String multiaddr) {

        sendEvent(this.reactContext, "newListenAddr", multiaddr);
    }



    /**
     * it will send  event to the react native
     *
     *  this function is overloaded, it will send a string event
     *
     * @param reactContext  context activity
     * @param eventName  event name
     * @param params  pameters to send
     */
    private static void sendEvent(ReactContext reactContext,
                                  String eventName,
                                  @Nullable String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    /**
     * it will send  event to the react native
     *
     *  this function is overloaded, it will send a WritableMap event
     *
     * @param reactContext  context activity
     * @param eventName  event name
     * @param params  pameters to send
     */
    private static void sendEvent(ReactContext reactContext,
                                  String eventName,
                                  @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
