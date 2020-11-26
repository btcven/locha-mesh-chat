package DeviceInfo;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import AudioModule.Player;
import AudioModule.PlayerModule;
import AudioModule.SoundModule;
import BitcoinJ.BitcoinModule;
import LocalNotification.LocalNotificationModule;

/**
 *  class used to register the native module and export it as a packet
 */
public class DeviceInfoPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new DeviceInfoModule(reactContext));
        modules.add(new BitcoinModule(reactContext));
        modules.add(new SoundModule(reactContext));
        modules.add(new PlayerModule(reactContext));

        return modules;
    }
}
