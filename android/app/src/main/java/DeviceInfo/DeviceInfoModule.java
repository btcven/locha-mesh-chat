package DeviceInfo;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;

public class DeviceInfoModule  extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public DeviceInfoModule(@Nonnull ReactApplicationContext reactContext ) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "RNDeviceInfo";
    }


    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("VersionInfo", getVersionInfo());
        return constants;
    }



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

}
