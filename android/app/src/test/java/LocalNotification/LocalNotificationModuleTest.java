package LocalNotification;

import android.content.Context;

import androidx.test.core.app.ApplicationProvider;

import com.facebook.react.bridge.ReactApplicationContext;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

import static org.junit.Assert.*;

@RunWith(RobolectricTestRunner.class)
public class LocalNotificationModuleTest {

    @Test public void sum (){
        assertEquals(4, 2+2);
    }


    @Test
    public void getReactApplicationContext() {
        ReactApplicationContext context =  new ReactApplicationContext(ApplicationProvider.getApplicationContext());

        new LocalNotificationModule(context);
    }
}