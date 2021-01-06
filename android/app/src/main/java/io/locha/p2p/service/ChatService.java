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

import io.locha.p2p.runtime.Runtime;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.lochameshchat.R;

/**
 * Chat service. This class manages the chat logic, such as starting and
 * stopping the server.
 */
public class ChatService extends Service {
    public static final String SERVICE_STARTED = "com.lochameshchat.SERVICE_STARTED";
    public static final String SERVICE_NOT_STARTED = "com.lochameshchat.SERVICE_NOT_STARTED";
    public static final String SERVICE_STOPPED = "com.lochameshchat.SERVICE_STOPPED";
    public static final String CLICK_FOREGROUND_NOTIFICATION = "com.lochameshchat.CLICK_FOREGROUND_NOTIFICATION";
    private String NOTIFICATION_CHANNEL_ID = "com.lochameshchat";
    private static final String DEFAULT_LISTEN_ADDRESS = "/ip4/0.0.0.0/tcp/4444";
    private static String TAG = "LochaP2P";
    private static int SERVICE_ID = 1337;

    public ChatService() {
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override public void onCreate() {
        super.onCreate();

        // Guard for Android >=8.0
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Log.d(TAG, String.format("Starting foreground on ver = %d", Build.VERSION.SDK_INT));
            startForegroundWithNotification();
        } else {
            Log.d(TAG, "Starting foreground");
            startForeground(SERVICE_ID, new Notification());
        }
    }

    private void startForegroundWithNotification() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            Log.e(TAG, "Can not start foreground on unsupported release");
            return;
        }

        createNotificationChannel();

        Intent notificationIntent = new Intent(CLICK_FOREGROUND_NOTIFICATION);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 0, notificationIntent, 0);
        Notification notification = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setOngoing(true)
                .setContentTitle("Locha Mesh Chat is running in the background")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationManager.IMPORTANCE_MIN)
                .setCategory(Notification.CATEGORY_SERVICE)
                .build();

        startForeground(SERVICE_ID, notification);
    }


    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, String.format("Initializing ChatService, flags=%d startId=%d", flags, startId));

        if (isStarted()) {
            Log.w(TAG, "Is ChatService started?");

            Intent notStarted = new Intent(SERVICE_NOT_STARTED);
            sendBroadcast(notStarted);

            return START_STICKY;
        }

        try {
            /* Retrieve the Runtime initialization parameters from the Intent */
            byte[] privateKey = intent.getByteArrayExtra("privateKey");
            boolean attemptUpnp = intent.getBooleanExtra("attemptUpnp", true);

            String addressListen = intent.getStringExtra("addressListen");
            if(addressListen == null){
                addressListen = DEFAULT_LISTEN_ADDRESS;
            }

            Log.i(TAG, "addressListen: "+ addressListen);
            /* Get the instance of our class that will dispatch the events to React Native JS */
            EventsDispatcher dispatcher = EventsDispatcher.getInstance();

            /* Initialize Runtime */
            Runtime runtime = Runtime.getInstance();
            runtime.start(dispatcher, privateKey, attemptUpnp, addressListen);

            /* Inform that the service started */
            Intent started = new Intent(SERVICE_STARTED);
            started.putExtra("peerId", runtime.getPeerId());
            sendBroadcast(started);
        } catch (Exception e) {
            Log.e(TAG, "Couldn't start service: %s", e);
            sendBroadcast(new Intent(SERVICE_NOT_STARTED));
        }

        return START_STICKY;
    }


    @Override public void onDestroy() {
        Runtime runtime = Runtime.getInstance();
        runtime.stop();

        sendBroadcast(new Intent(SERVICE_STOPPED));
    }

    private boolean isStarted() {
        return Runtime.isStarted();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannel() {
        NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID,
                                                           "Background Service",
                                                           NotificationManager.IMPORTANCE_LOW);
        chan.setLightColor(Color.BLUE);
        chan.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        NotificationManager manager =
            (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        assert manager != null;
        manager.createNotificationChannel(chan);
    }
}
