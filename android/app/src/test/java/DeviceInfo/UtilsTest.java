package DeviceInfo;

import com.facebook.common.util.Hex;

import org.junit.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.StringUtils;

import java.io.UnsupportedEncodingException;

import static org.junit.jupiter.api.Assertions.*;


class UtilsTest {


    private static final String TEST = "test";

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
//
//    @org.junit.jupiter.api.Test
//    void loadFileAsString() {
//    }
//
//    @Test
//    void getMACAddress() {
//    }
//
    @Test
    void hexStringToByteArray() {

        byte[] bytes =  Utils.hexStringToByteArray(TEST);
        String result = new String(bytes);
        String expected = new String(bytes);
        assertEquals(result, expected);
    }

//    @Test
//    void getNetworkInfo() {
//    }
//
//    @Test
//    void isConnected() {
//    }
//
//    @Test
//    void getOurVersion() {
//    }
//
//    @Test
//    void getAllIps() {
//    }
}