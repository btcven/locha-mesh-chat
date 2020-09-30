package DeviceInfo;

import android.content.Context;
import android.net.NetworkInfo;

import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class UtilsTest {

    Utils utils;
    Context appContext;
    @Before
    public void setUp() throws Exception {
       utils = new Utils();
       appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
    }

    @Test
    public void instanceNotNull(){
        assertNotNull(utils);
    }

    @Test
    public void getVersion(){
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        String version =  Utils.getOurVersion(appContext);

        assertEquals("1.0", version);

    }

    @Test
    public void getAllIps() {
        List<String> ips = Utils.getAllIps();

        assertNotNull(ips);
    }

    @Test
    public void getNetWordInfo(){
        NetworkInfo info = Utils.getNetworkInfo(appContext);
        assertNotNull(info);
    }


}