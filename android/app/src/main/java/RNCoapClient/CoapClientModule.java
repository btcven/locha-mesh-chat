package RNCoapClient;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class CoapClientModule extends ReactContextBaseJavaModule {

    private ReactContext context;
    public CoapClientModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        context = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "RNCoapClient";
    }

    @ReactMethod
    public void test(){
        Log.i("test", "hello");
    }
}
