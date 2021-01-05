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

import DeviceInfo.DeviceInfoModule;
import io.locha.p2p.runtime.Runtime;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;

import android.provider.Settings;
import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Timer;
import java.util.TimerTask;

import DeviceInfo.Utils;

/**
 * React Native interface to ChatService foreground service.
 */
public class ChatServiceModule extends ReactContextBaseJavaModule {
    public static final String ENOTCONNECTED = "ENOTCONNECTED";
    public static final String ENOTSTARTED = "ENOTSTARTED";

    private static final String TAG = "LochaP2P";

    public ReactApplicationContext reactContext;

    private Intent serviceIntent = null;
    private String peerId = null;
    private Promise mPromise;
    private boolean isServiceStarted = false;
    private boolean wifiConnection = true;
    private boolean mobileConnection = true;
    EventsDispatcher event;
    private final static  int  RECHARGE_TIME = 6000;
    private final static  int  WAIT_TIME = 2000;

    public ChatServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;

        event = EventsDispatcher.getInstance();

        /* The EventsDispatcher class is responsible for sending events from the Chat
         * Service to the React Native JS context, it's a singleto that is shared between
         * our class and ChatService which in turns passes it to Runtime as the events handler
         */
        EventsDispatcher dispatcher = EventsDispatcher.getInstance();
        dispatcher.setApplicationContext(this.reactContext);

        IntentFilter filter = new IntentFilter();
        filter.addAction(ChatService.SERVICE_STARTED);
        filter.addAction(ChatService.SERVICE_NOT_STARTED);
        filter.addAction(ChatService.SERVICE_STOPPED);
        filter.addAction(ChatService.CLICK_FOREGROUND_NOTIFICATION);
        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);

        this.reactContext.registerReceiver(broadcastReceiver, filter);
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
     * @param attemptUpnp Whether to enable UPnP and attempt to use it to discover
     * our external IP address and do port mapping.
     */
    @ReactMethod public void start(String privateKey, boolean attemptUpnp,  String addressListen, Promise promise) {
        this.mPromise = promise;

        try {
            byte[] privateKeyBytes = Utils.hexStringToByteArray(privateKey);

            this.serviceIntent = new Intent(this.reactContext, ChatService.class);
            this.serviceIntent.putExtra("privateKey", privateKeyBytes);
            this.serviceIntent.putExtra("attemptUpnp", attemptUpnp);
            if(addressListen != null){
                String _addressListen = addRequiredAdressFormat(addressListen);
                this.serviceIntent.putExtra("addressListen", _addressListen);
            }

            // Guard for Android >=8.0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Log.d(TAG, "Starting foreground service");
                this.reactContext.startForegroundService(this.serviceIntent);
            } else {
                Log.d(TAG, "Starting normal service");
                this.reactContext.startService(this.serviceIntent);
            }
        } catch (Exception e) {
            this.mPromise.reject(ENOTSTARTED, e);
        }
    }

    /**
     * Stop the service
     */
    @ReactMethod public void stop(Promise promise) {
        try {
            this.reactContext.stopService(serviceIntent);
            promise.resolve(null);
        } catch (Exception e) {
            Log.e(TAG, "Couldn't stop service", e);
            promise.reject(ENOTSTARTED, e);
        }
    }

    /**
     * Stop the service
     */
    public void stop() {
        try {
            this.reactContext.stopService(serviceIntent);
        } catch (Exception e) {
            Log.e(TAG, "Couldn't stop service", e);
        }
    }

    /**
     * Returns our known/observed external addresses.
     *
     * @param promise Promise that will resolve to our external addresses.
     */
    @ReactMethod public void getExternalAddresses(Promise promise) {
        try {
            String[] addrs = Runtime.getInstance().externalAddresses();
            WritableArray promiseAddrs = Arguments.createArray();
            for (String addr : addrs) {
                promiseAddrs.pushString(addr);
            }
            promise.resolve(promiseAddrs);
        } catch (RuntimeException e) {
            promise.reject(ENOTSTARTED, e);
        }
    }

    /**
     * Get our PeerId
     *
     * @param promise Promise that will be resolved when the PeerId is returned.
     */
    @ReactMethod public void getPeerId(Promise promise) {
        if (peerId == null) {
            promise.reject(ENOTSTARTED, "peerId is null");
            return;
        }

        promise.resolve(peerId);
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
    @ReactMethod public void dial(String multiaddr, Promise promise) {
        try {
            Runtime.getInstance().dial(multiaddr);
            promise.resolve(null);
        } catch (RuntimeException e) {
            Log.e(TAG, "Couldn't dial address", e);
            promise.reject(ENOTSTARTED, e);
        }
    }

    /**
     * Send a message
     *
     * @param contents The message contents.
     */
    @ReactMethod public void sendMessage(String contents) {
        try {
            Runtime.getInstance().sendMessage(contents);
        } catch (RuntimeException e) {
            Log.e(TAG, "Couldn't send message", e);
        }
    }

    /**
     * Is service started?
     *
     * @param promise Promise that will resolve to the "is started" value.
     */
    @ReactMethod public void isStarted(Promise promise) {
        promise.resolve(this.isServiceStarted && Runtime.isStarted());
    }

    public String addRequiredAdressFormat(String ip) throws UnknownHostException {
           InetAddress address = InetAddress.getByName(ip);
           if (address instanceof Inet6Address) {
               return String.format("/ip6/%s/tcp/4444", ip);
           } else if (address instanceof Inet4Address) {
               return  String.format("/ip4/%s/tcp/4444", ip);
           }
           return ip;
    }

    @ReactMethod public void addNewChatService(String privKey ,String address, Promise promise){
       try {
           // the service was stopped to start it again with a new address
           stop();
           // starting service again
           start(privKey,false, address, promise );


       } catch (Exception e) {
           Log.e(TAG, "failed to add the new listening address: ", e);
       }

    }

    public void spawnExternalIpAddrThread()  {

         Thread thread = new Thread(new Runnable() {
             public void run() {
                 try{
                     Thread.sleep(WAIT_TIME);
                     // Wait at least 2 s before checking for external addresses as UPnP and other

                     Timer timer = new Timer();

                     timer.schedule( new TimerTask() {
                         public void run() {
                            if( Runtime.getInstance().isStarted()) {
                                String[] ips =  Runtime.getInstance().externalAddresses();
                                for (String ip : ips) {
                                    event.onExternalAddress(ip);
                                }
                            }
                         }
                     }, 0, RECHARGE_TIME);

                 } catch (Exception e){
                     Log.e(TAG, "getExternalAddress: failed: ",e);
                 }
             }
         });

        thread.start();
    }

    /**
     * BroadcastReceiver is where we will be listening to all the events returned
     * by ChatService
     */
    private BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override public void onReceive(Context context, Intent intent) {
            Log.d(TAG, String.format("broadcastReceiver, action=\"%s\"", intent.getAction()));

            String action = intent.getAction();
            assert action != null;

            if (action.equals(ChatService.SERVICE_STARTED)) {
                Log.d(TAG, "ChatService successfully started");
                isServiceStarted = true;
                peerId = intent.getStringExtra("peerId");
                assert peerId != null;
                mPromise.resolve(peerId);
                event.isConnected(Utils.isConnected(context));
                try {
                    spawnExternalIpAddrThread();
                } catch (Exception e) {
                    Log.e(TAG, "Couldn't spawn External IP worker thread: ", e);
                }
                Log.d(TAG, String.format("Started with peerId=%s", peerId));
                return;
            }

            if (action.equals(ChatService.SERVICE_NOT_STARTED)) {
                Log.d(TAG, "ChatService failed to start");
                mPromise.reject(ENOTSTARTED, "Service failed to start");
                return;
            }

            if (action.equals(ChatService.SERVICE_STOPPED)) {
                Log.d(TAG, "ChatService successfully stopped");
                isServiceStarted = false;
                if(mPromise != null){
                    mPromise.resolve(null);
                }
                return;
            }

            if (action.equals(ChatService.CLICK_FOREGROUND_NOTIFICATION)) {
                try {
                    Uri uri = Uri.fromParts("package", reactContext.getPackageName(), null);

                    Intent appDetails = new Intent();
                    appDetails.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    appDetails.setData(uri);
                    appDetails.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                    reactContext.getApplicationContext().startActivity(appDetails);
                } catch (Exception e) {
                    Log.e(TAG, "Couldn't start application details settings", e);
                }
            }

            if(action.equals(ConnectivityManager.CONNECTIVITY_ACTION)){

                    ConnectivityManager connectivity = (ConnectivityManager) context
                            .getSystemService(Context.CONNECTIVITY_SERVICE);

                    NetworkInfo[] netInfo = connectivity.getAllNetworkInfo();

                    Log.i(TAG, "ConnetionChanged: " + Utils.isConnected(context));
                    event.connectionChanged(Utils.isConnected(context));
            }

        }
    };
}
