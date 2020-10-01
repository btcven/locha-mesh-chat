package LocalNotification;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.lochameshchat.MainActivity;
import com.lochameshchat.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Random;
import java.util.Set;


public class LocalNotificationModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final ReactApplicationContext reactContext;
    private final static String CHANNEL_ID = "NOTIFICACION";
    private final static String TAG = "NOTIFICACION_MODULE";
    private int NOTIFICACION_ID = 0;
    private final Random mRandomNumberGenerator = new Random(System.currentTimeMillis());
    private NotificationManagerCompat notificationManager;

    public LocalNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);

    }

    @Override
    public String getName() {
        return "LocalNotification";
    }

    @ReactMethod
    public void createNotification (ReadableMap details){

        Bundle bundle = Arguments.toBundle(details);
        Log.i(TAG, "ID" + bundle.getString("id") );
        Log.i(TAG, "TITLE" + bundle.getString("title") );
        Log.i(TAG, "MESSAGE" + bundle.getString("message") );
        // If notification ID is not provided by the user, generate one at random
        String id = bundle.getString("id");
        if (id == null && id.length() == 0) {
            bundle.putString("id", String.valueOf(mRandomNumberGenerator.nextInt()));
        }
        createNotificationChannel();
        createLocalNotify(bundle);
    }

    private void createNotificationChannel( ){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            CharSequence name = "Noticacion";
            NotificationChannel notificationChannel = new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_HIGH);
            notificationChannel.enableVibration(true);
            NotificationManager manager =  (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
            manager.createNotificationChannel(notificationChannel);
        }
    }

    private void sendEvent (String eventName , Object params){
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }

    }

    private void createLocalNotify(Bundle bundle){

        int notifyID = Integer.parseInt(bundle.getString("id"));
        Intent intent = new Intent(reactContext, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.putExtra("Notification",  bundle);

        PendingIntent contentIntent = PendingIntent.getActivity(reactContext, notifyID, intent,
                PendingIntent.FLAG_UPDATE_CURRENT);


        Resources res = this.reactContext.getResources();
        int largeIconResId;
        String packageName = this.reactContext.getPackageName();


        largeIconResId = res.getIdentifier("ic_launcher", "mipmap", packageName);
        Bitmap largeIconBitmap = BitmapFactory.decodeResource(res, largeIconResId);

        Notification notification = new NotificationCompat.Builder(reactContext, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(bundle.getString("title"))
                .setContentText(bundle.getString("message"))
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setContentIntent(contentIntent)
                .setAutoCancel(true)
                .setOnlyAlertOnce(true)
                .setVibrate(new long[]{100L, 300L})
                .setLargeIcon(largeIconBitmap)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(bundle.getString("message")))
                .build();

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.notify(notifyID, notification);

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.d("hello", " activity");
    }

    @Override
    public void onNewIntent(Intent intent) {
        Bundle message = intent.getBundleExtra("Notification");

        if(message != null){

            String result =  convertJSON(message);
            WritableMap params = Arguments.createMap();
            params.putString("dataJSON" ,result);

            sendEvent("NoticationReceiver", params);
        }

    }


    @ReactMethod
    public void clearNotificationID (int id) {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.cancel(id);
    }


    @ReactMethod
    public void clearNotificationAll () {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.cancelAll();
    }


    String convertJSON(Bundle bundle) {
        try {
            JSONObject json = convertJSONObject(bundle);
            return json.toString();
        } catch (JSONException e) {
            return null;
        }
    }


    JSONObject convertJSONObject(Bundle bundle) throws JSONException {
        JSONObject json = new JSONObject();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            Object value = bundle.get(key);
            if (value instanceof Bundle) {
                json.put(key, convertJSONObject((Bundle)value));
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                json.put(key, JSONObject.wrap(value));
            } else {
                json.put(key, value);
            }
        }
        return json;
    }

}
