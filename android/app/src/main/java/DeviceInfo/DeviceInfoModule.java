package DeviceInfo;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;

/**
 *  class used to obtain device information
 */
public class DeviceInfoModule  extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

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
//        constants.put("globalIpv6", getIpv6());
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
                        if(ipaddress.startsWith("2001")){
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


}
