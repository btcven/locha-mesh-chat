package BitcoinJ;

import android.annotation.TargetApi;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

// these are the instrumentation tests these are necessary to run them with the emulator

public class CryptoLibTest {
    CryptoLib cryptoLib;

    @Before
    public void SetUp(){
        cryptoLib = new CryptoLib();
    }

    @Test
    public void  encryptTest(){
        String result = cryptoLib.encrypt("test", "test");
        assertNotNull(result);
    }

    @Test
    public void decrypTest(){
        String result = cryptoLib.encrypt("test", "test");
        String code = cryptoLib.decrypt(result, "test" );
        assertEquals("test", code);
    }

}