package DeviceInfo;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.lochameshchat.MainActivity;

import java.io.File;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

/**
 *  class used to obtain device information
 */
public class DeviceInfoModule  extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final static String TAG = "DeviceInfo";

    public DeviceInfoModule(@Nonnull ReactApplicationContext reactContext ) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    /**
     * method of the ReactContextBaseJavaModule class used to name the module
     */
    @Nonnull
    @Override
    public String getName() {
        return "RNDeviceInfo";
    }


    /**
     * method used to obtain the constants
     * @return constants
     */

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("VersionInfo", getVersionInfo());
        constants.put("DocumentDirectoryPath",  reactContext.getFilesDir().getAbsolutePath());
        return constants;
    }


    /**
     * method used to get the build version
     * @return Version
     */
    public  String getVersionInfo () {
        PackageInfo pInfo = null;
        try {
            pInfo = reactContext.getPackageManager().getPackageInfo(reactContext.getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        String version = pInfo.versionName;

        return version;
    }

    @ReactMethod
    public void getIpv6(Promise promise) {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface
                    .getNetworkInterfaces(); en.hasMoreElements(); ) {

                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf
                        .getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress() && inetAddress instanceof Inet6Address) {
                        String ipaddress = inetAddress.getHostAddress().toString();
                        if(ipaddress.startsWith("2001") || ipaddress.startsWith("fc00") ){
                            promise.resolve(ipaddress); ;
                        }
                    }

                }

            }
        } catch (Exception ex) {
            promise.reject("Error", ex.toString());
            Log.e("IP Address", ex.toString());
        }

        promise.reject("Error", "error");
    }

   @ReactMethod public void getIpv6Andipv4Adress(Promise promise){

        List<String> ipInterface =  Utils.getAllIps();

       for (String address: ipInterface) {
           Log.i(TAG, "getIpv6Andipv4Adress: " + address);
       }

       WritableArray array = Arguments.fromList(ipInterface);

       promise.resolve(array);
   }

    @ReactMethod public void scanFile(String path) {
        Log.i(TAG, "scanFile:  " + reactContext.getFilesDir().getAbsolutePath());
        File file = new File(path);
        if(!file.exists()){
            Log.e(TAG, "scanFile: file doesn't exists" + path);
            return;
        }

        MediaScannerConnection.scanFile(reactContext,
                new String[] { path }, null,
                new MediaScannerConnection.OnScanCompletedListener() {

                    public void onScanCompleted(String path, Uri uri) {
                        Log.i("TAG", "Finished scanning" + path);
                    }
                });
    }

    /**
     * close the app completely
     */
   @ReactMethod public void exitApp(){
       System.exit(0);
   }
}
