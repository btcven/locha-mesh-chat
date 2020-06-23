package WiFiModule;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Process;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import javax.annotation.Nonnull;

public class WifiModule  extends ReactContextBaseJavaModule  implements PermissionListener {
     private ReactApplicationContext context;
     private static final String TAG = "wifiModule";
     private boolean statePermision;
     private WifiManager wifi;

    public WifiModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        wifi = (WifiManager) context.
                getApplicationContext().
                getSystemService(Context.WIFI_SERVICE);
    }

    @Nonnull
    @Override
    public String getName() {
        return "RNwifiModule";
    }


    public void wifiIsEnabled () {
        System.out.println("is enabled?:"+ wifi.isWifiEnabled());

      if(wifi.isWifiEnabled()){
          ConnectivityManager connManager = (ConnectivityManager) context
                  .getApplicationContext()
                  .getSystemService(Context.CONNECTIVITY_SERVICE);
          NetworkInfo mWifi = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);

          if (mWifi.isConnected() && statePermision) {
              wifi.disconnect();
          }

      }else{
          wifi.setWifiEnabled(true);
      }

    }


    public void wifiPermision () {
        int permission;
        String[] arg = new String[]{Manifest.permission.ACCESS_WIFI_STATE, Manifest.permission.CHANGE_WIFI_STATE };
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            permission = context.checkPermission(Manifest.permission.ACCESS_WIFI_STATE, Process.myPid(), Process.myUid());

            System.out.println("permiso is:"+ permission);
        }else{

            permission=  context.checkSelfPermission(Manifest.permission.ACCESS_WIFI_STATE);
            System.out.println("permiso is:" + permission);
        }
        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        if(permission != PackageManager.PERMISSION_GRANTED ){
            activity.requestPermissions(arg, 0 , this);
        }else{
            statePermision = true;
        }
    }


    @ReactMethod
    public void connect(){
        wifiPermision();
        wifiIsEnabled();

        String networkSSID = "Wilink_264D802";
        String networkPass = "pirulin08.";

        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = String.format("\"%s\"", networkSSID);
        conf.preSharedKey = String.format("\"%s\"", networkPass);


        int netId = wifi.addNetwork(conf);
        wifi.disconnect();
       if( wifi.enableNetwork(netId, true)){
           wifi.reconnect();
       }

    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        return false;
    }
}
