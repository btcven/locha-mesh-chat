package DeviceInfo;


import android.content.pm.PackageManager;

import androidx.annotation.NonNull;
import androidx.test.core.app.ApplicationProvider;

import com.facebook.common.util.Hex;
import com.facebook.react.bridge.ReactApplicationContext;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import java.io.UnsupportedEncodingException;

import static org.junit.jupiter.api.Assertions.*;


@Config(sdk = 28)
@RunWith(RobolectricTestRunner.class)
class UtilsTest {

    private static final String TEST = "test";

    @NonNull
    private ReactApplicationContext getRNContext() {
        return new ReactApplicationContext(ApplicationProvider.getApplicationContext());
    }
    @Test
    public void noNullInstance(){
        Utils utils = new Utils();
        assertNotNull(utils);
    }

    @Test
    public void sum(){
        assertEquals(2,  Utils.suma(1,1));
    }

    @Test
    void bytesToHex() {
        byte[] data =  TEST.getBytes();
        String result = new String(Hex.decodeHex(Utils.bytesToHex(data)));
        assertEquals(TEST, result);
    }

    @Test
    void getUTF8Bytes() throws UnsupportedEncodingException {

        assertEquals( new String(TEST.getBytes("UTF-8")),
                      new String(TEST.getBytes("UTF-8")) );
    }

    @Test
    void hexStringToByteArray() {
        byte[] bytes =  Utils.hexStringToByteArray(TEST);
        String result = new String(bytes);
        String expected = new String(bytes);
        assertEquals(result, expected);
    }



}