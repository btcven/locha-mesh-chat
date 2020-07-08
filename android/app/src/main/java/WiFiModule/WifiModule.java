package WiFiModule;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Process;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;

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

    /**
     * Verify that WiFi is disabled
     *
     */
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

    /**
     * function used to check WiFi permissions
     *
     */
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

    /**
     *  function used to activate the phone's wifi and make the connection
     * @param credentials
     */
    @ReactMethod public void connect(ReadableMap credentials){
        wifiPermision();
        wifiIsEnabled();


        Bundle bundle = Arguments.toBundle(credentials);

        String ssid = bundle.getString("ssid");
        String password = bundle.getString("password");

        Log.i(TAG, "the ssid is: " + ssid);
        Log.i(TAG, "the password is: " + password.length());

        String networkSSID = ssid;
        String networkPass = password;


        WifiConfiguration wc = new WifiConfiguration();
        wc.SSID = "\"" + networkSSID + "\"";
        wc.priority = 40;
        wc.status = WifiConfiguration.Status.ENABLED;

        if(password.length() > 0){
            wc.preSharedKey = "\"" + networkPass + "\"";
        }else{
            wc.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
        }

        try {
            setStaticIpConfiguration(wifi, wc,
                    InetAddress.getByName("192.168.0.100"),
                    24,
                    InetAddress.getByName("10.0.0.2"),
                    new InetAddress[]{InetAddress.getByName("8.8.8.8"), InetAddress.getByName("8.8.4.4")});

        } catch (Exception e) {
            e.printStackTrace();
        }

           IntentFilter intentFilter = new IntentFilter();
           intentFilter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
           intentFilter.addAction(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION);

           context.registerReceiver(connectedToLocalWifiReceiver, intentFilter);

    }

    /**
     *
     * this method adds the static ip configuration
     * @param manager
     * @param config
     * @param ipAddress
     * @param prefixLength
     * @param gateway
     * @param dns
     * @throws ClassNotFoundException
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     * @throws NoSuchMethodException
     * @throws NoSuchFieldException
     * @throws InstantiationException
     */
    @SuppressWarnings("unchecked")
    public static void setStaticIpConfiguration(WifiManager manager, WifiConfiguration config, InetAddress ipAddress, int prefixLength, InetAddress gateway, InetAddress[] dns) throws ClassNotFoundException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, NoSuchFieldException, InstantiationException {
        // First set up IpAssignment to STATIC.
        Object ipAssignment = getEnumValue("android.net.IpConfiguration$IpAssignment", "STATIC");
        callMethod(config, "setIpAssignment", new String[]{"android.net.IpConfiguration$IpAssignment"}, new Object[]{ipAssignment});

        // Then set properties in StaticIpConfiguration.
        Object staticIpConfig = newInstance("android.net.StaticIpConfiguration");
        Object linkAddress = newInstance("android.net.LinkAddress", new Class<?>[]{InetAddress.class, int.class}, new Object[]{ipAddress, prefixLength});

        setField(staticIpConfig, "ipAddress", linkAddress);
        setField(staticIpConfig, "gateway", gateway);
        getField(staticIpConfig, "dnsServers", ArrayList.class).clear();
        for (int i = 0; i < dns.length; i++)
            getField(staticIpConfig, "dnsServers", ArrayList.class).add(dns[i]);

        callMethod(config, "setStaticIpConfiguration", new String[]{"android.net.StaticIpConfiguration"}, new Object[]{staticIpConfig});

        int netId = manager.addNetwork(config);


        boolean result = netId != -1;
        Log.i(TAG, "Dios mio" + result);
        if (result) {
            boolean isDisconnected = manager.disconnect();
            boolean isEnabled = manager.enableNetwork(netId, true);
            boolean isReconnected = manager.reconnect();
        }
    }


    /**
     * this function has the wifi configuration once it is connected
     * @param context
     * @return WifiConfiguration
     */
    public static WifiConfiguration getCurrentWiFiConfiguration(Context context) {
        WifiConfiguration wifiConf = null;
        ConnectivityManager connManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        if (networkInfo.isConnected()) {
            final WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
            final WifiInfo connectionInfo = wifiManager.getConnectionInfo();
            if (connectionInfo != null && !TextUtils.isEmpty(connectionInfo.getSSID())) {
                List<WifiConfiguration> configuredNetworks = wifiManager.getConfiguredNetworks();
                if (configuredNetworks != null) {
                    for (WifiConfiguration conf : configuredNetworks) {
                        if (conf.networkId == connectionInfo.getNetworkId()) {
                            wifiConf = conf;
                            break;
                        }
                    }
                }
            }
        }
        return wifiConf;
    }


    private static Object newInstance(String className) throws ClassNotFoundException, InstantiationException, IllegalAccessException, NoSuchMethodException, IllegalArgumentException, InvocationTargetException {
        return newInstance(className, new Class<?>[0], new Object[0]);
    }

    private static Object newInstance(String className, Class<?>[] parameterClasses, Object[] parameterValues) throws NoSuchMethodException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, ClassNotFoundException {
        Class<?> clz = Class.forName(className);
        Constructor<?> constructor = clz.getConstructor(parameterClasses);
        return constructor.newInstance(parameterValues);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private static Object getEnumValue(String enumClassName, String enumValue) throws ClassNotFoundException {
        Class<Enum> enumClz = (Class<Enum>) Class.forName(enumClassName);
        return Enum.valueOf(enumClz, enumValue);
    }

    private static void setField(Object object, String fieldName, Object value) throws IllegalAccessException, IllegalArgumentException, NoSuchFieldException {
        Field field = object.getClass().getDeclaredField(fieldName);
        field.set(object, value);
    }

    private static <T> T getField(Object object, String fieldName, Class<T> type) throws IllegalAccessException, IllegalArgumentException, NoSuchFieldException {
        Field field = object.getClass().getDeclaredField(fieldName);
        return type.cast(field.get(object));
    }

    private static void callMethod(Object object, String methodName, String[] parameterTypes, Object[] parameterValues) throws ClassNotFoundException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException {
        Class<?>[] parameterClasses = new Class<?>[parameterTypes.length];
        for (int i = 0; i < parameterTypes.length; i++)
            parameterClasses[i] = Class.forName(parameterTypes[i]);

        Method method = object.getClass().getDeclaredMethod(methodName, parameterClasses);
        method.invoke(object, parameterValues);
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        return false;
    }


    /**
     * event that runs when starting a new connection
     */
    BroadcastReceiver connectedToLocalWifiReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
             Log.i(TAG, "excute broadcastReceive" + intent.getAction());

            if (intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) {

                ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
                NetworkInfo networkInfo = cm.getActiveNetworkInfo();

                if (networkInfo != null && networkInfo.getType() == ConnectivityManager.TYPE_WIFI &&
                        networkInfo.isConnected()) {
                    // Wifi is connected
                    WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
                    WifiInfo wifiInfo = wifiManager.getConnectionInfo();
                    String ssid = wifiInfo.getSSID();

                    Log.e(TAG, " -- Wifi connected --- " + " SSID " + ssid );

                }
            }
            else if (intent.getAction().equalsIgnoreCase(WifiManager.WIFI_STATE_CHANGED_ACTION))
            {
                int wifiState = intent.getIntExtra(WifiManager.EXTRA_WIFI_STATE, WifiManager.WIFI_STATE_UNKNOWN);
                if (wifiState == WifiManager.WIFI_STATE_DISABLED)
                {
                    Log.e(TAG, " ----- Wifi  Disconnected ----- ");
                }

            }
        }
    };

}
