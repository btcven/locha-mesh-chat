package com.lochameshchat;


import android.app.Application;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactlibrary.LanguageDetectorPackage;

import DeviceInfo.DeviceInfoPackage;
import LocalNotification.LocalNotificationPackage;
import cl.json.RNSharePackage;
import com.wenkesj.voice.VoicePackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage; // Import package
import com.bitgo.randombytes.RandomBytesPackage;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import org.reactnative.camera.RNCameraPackage;
import com.rnfs.RNFSPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFetchBlobPackage(),
            new AsyncStoragePackage(),
            new LocalNotificationPackage(),
            new LanguageDetectorPackage(),
            new RNSharePackage(),
            new VoicePackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new ReactSliderPackage(),
            new RNSoundPackage(),
            new ReactNativeAudioPackage(),
            new BackgroundTimerPackage(),
            new RandomBytesPackage(),
            new SvgPackage(),
            new RealmReactPackage(),
            new RNCameraPackage(),
            new RNFSPackage(),
            new PickerPackage(),
            new CameraRollPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new DocumentPickerPackage(),
            new DeviceInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
