package io.locha.p2p.runtime;

import androidx.test.core.app.ApplicationProvider;

import com.facebook.react.bridge.ReactApplicationContext;

import org.bitcoinj.core.Sha256Hash;
import org.junit.Before;
import org.junit.Test;

import BitcoinJ.CryptoLib;
import BitcoinJ.CryptoLibTest;
import DeviceInfo.Utils;
import io.locha.p2p.service.EventsDispatcher;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class RustNativeTest {

     Runtime runtime;
     String[] Externaladdress;
    @Before
    public void setUp() throws Exception {
        runtime = Runtime.getInstance();
    }

    @Test
    public void instanceNotNull(){
        assertNotNull(runtime);
    }

    @Test
    public void startService(){

        ReactApplicationContext reactContext = new  ReactApplicationContext(ApplicationProvider.getApplicationContext());
        EventsDispatcher dispacher = EventsDispatcher.getInstance();
        dispacher.setApplicationContext(reactContext);

        byte[] key = Utils.hexStringToByteArray(new CryptoLib().sha256("test"));
        runtime.start(dispacher, key, false,"/ip4/0.0.0.0/tcp/4444");
        assertEquals(true, runtime.isStarted());
        runtime.stop();
    }


    @Test
    public void stop(){
        assertEquals(false, runtime.isStarted());
    }

}