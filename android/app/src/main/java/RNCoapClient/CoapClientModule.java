package RNCoapClient;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapResponse;
import org.eclipse.californium.core.coap.CoAP;
import org.eclipse.californium.core.coap.Request;
import org.eclipse.californium.core.network.CoapEndpoint;
import org.eclipse.californium.core.network.config.NetworkConfig;
import org.eclipse.californium.core.network.config.NetworkConfig.Keys;
import org.eclipse.californium.core.network.config.NetworkConfigDefaultHandler;
import org.eclipse.californium.core.network.interceptors.HealthStatisticLogger;
import org.eclipse.californium.elements.exception.ConnectorException;

import java.io.File;
import java.io.IOException;

import javax.annotation.Nonnull;



public class CoapClientModule extends ReactContextBaseJavaModule {

    public static String TAG = "COAP_CLIENT";

    private static final File CONFIG_FILE = new File("Californium.properties");
    private static final String CONFIG_HEADER = "Californium CoAP Properties file for Fileclient";
    private static final int DEFAULT_MAX_RESOURCE_SIZE = 1 * 1024 * 1024; // 1 MB
    private static final int DEFAULT_BLOCK_SIZE = 512;

    private static final String typeGet = "get";
    private static final String typePost = "post";

    private static NetworkConfigDefaultHandler DEFAULTS = new NetworkConfigDefaultHandler() {

        @Override
        public void applyDefaults(NetworkConfig config) {
            config.setInt(Keys.MAX_RESOURCE_BODY_SIZE, DEFAULT_MAX_RESOURCE_SIZE);
            config.setInt(Keys.MAX_MESSAGE_SIZE, DEFAULT_BLOCK_SIZE);
            config.setInt(Keys.PREFERRED_BLOCK_SIZE, DEFAULT_BLOCK_SIZE);
        }
    };

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


    /**
     * request handler
     * @param url
     * @param type
     * @param promise
     */
    @ReactMethod  public void request(String url, String type, Promise promise){

        NetworkConfig config = NetworkConfig.createWithFile(CONFIG_FILE, CONFIG_HEADER, DEFAULTS);
        int port = config.getInt(Keys.COAP_PORT);
        HealthStatisticLogger health = new HealthStatisticLogger("unitcast-client", true);
        CoapEndpoint endpoint = new CoapEndpoint.Builder().setNetworkConfig(config).build();
        endpoint.addPostProcessInterceptor(health);


        CoapClient client = new CoapClient();
        String uri = url;
        client.setURI(uri);


        Thread threadRequest =  new Thread(new Runnable() {
            public void run() {
                if (type.compareTo(typeGet) == 0) {
                    Log.i(TAG, "!!!!!!in the get: ");
                    getRequest(client, promise);
                } else if (type.compareTo(typePost) == 0) {
                    Log.i(TAG, "in the post: ");
                    postRequest(client, promise);
                } else {
                    Log.i(TAG, "invalid request type: ");
                    promise.reject("Error", "invalid request type");
                }
            }
        });

        threadRequest.start();
    }



    /**
     *  function used when the data type is get
     *
     * @param client client coap
     * @param promise React native promise
     */
    private void getRequest(CoapClient client, Promise promise){

        Request request = Request.newGet();
        request.setType(CoAP.Type.CON);
        // sends an uni-cast request
        CoapResponse response = null;
        client.setTimeout((long) 5000);
        try {
            response = client.advanced(request);
        } catch (ConnectorException e) {
           promise.reject("Error", e.toString());
        } catch (IOException e) {
            promise.reject("Error", e.toString());
        }
        if (response != null) {
            Log.i(TAG, "get request "+ response.getResponseText().toString());
           promise.resolve(response.getResponseText().toString());
        } else {
            promise.reject("Error","No response received.");
        }

    }


    /**
     *  function used when the data type is post
     *
     * @param client client coap
     * @param promise React native promise
     */
    private void postRequest(CoapClient client, Promise promise){
        Request request = Request.newPost();
        request.setPayload("test");

        request.setType(CoAP.Type.CON);
        // sends an uni-cast request
        CoapResponse response = null;
        try {
            response = client.advanced(request);
        } catch (ConnectorException e) {
            promise.reject("Error", e.toString());
        } catch (IOException e) {
            promise.reject("Error", e.toString());
        }
        if (response != null) {
            promise.resolve(response.getResponseText().toString());
        } else {
            promise.reject("Error","No response received.");
        }

    }
}




