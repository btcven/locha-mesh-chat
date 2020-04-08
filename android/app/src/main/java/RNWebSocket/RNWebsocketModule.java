package RNWebSocket;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.security.cert.CertificateException;

import javax.annotation.Nullable;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

public class RNWebsocketModule  extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private WebSocket webSocket;
    public final String TAG = "WEBSOCKET MODULE";

    /**
     * constructor
     * @param reactContext
     */
    public RNWebsocketModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    /**
     * the name is added to the module
     * @return RNWebsocketModule - module name
     */
    @Override
    public String getName() {
        return "RNWebsocketModule";
    }


    @ReactMethod
    public void instantiateWeboscket(String url){

        OkHttpClient client = getUnsafeOkHttpClient();

        Request request = new Request.Builder().url(url).build();

        SocketListener socketListener = new SocketListener(reactContext);

         webSocket = client.newWebSocket(request, socketListener);
    }

    /**
     * Sending messages
     * @param message
     */
    @ReactMethod public void sendSocket (String message){

        Log.d(TAG , "mensaje que se va enviar: "+ message);

        webSocket.send(message);


    }

    /**
     * executes an event that sends the type and data to react native
     * @param eventName name of the event
     * @param params send parameters
     */
    public void sendEvent (String eventName , Object params){
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }


    /**
     * websocket library is configured to connect to a server with self-signed certificate
     * @return OkHttpClient
     */
    private OkHttpClient getUnsafeOkHttpClient() {
        try {
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {

                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain,
                                                       String authType) throws
                                CertificateException {
                        }

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain,
                                                       String authType) throws
                                CertificateException {
                        }
                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new java.security.cert.X509Certificate[]{};
                        }
                    }
            };

            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0]);

            builder.hostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });

            return builder.build();
        } catch (Exception e) {
            Log.e(TAG, "getUnsafeOkHttpClient: error");
            throw new RuntimeException(e);
        }
    }


    /**
     *  class containing websocket functions
     */
    public class SocketListener extends WebSocketListener {
        ReactApplicationContext activity;
        public SocketListener(ReactApplicationContext reactContext){
            this.activity = reactContext;
        }

        @Override
        public void onOpen(WebSocket webSocket, Response response) {
            super.onOpen(webSocket, response);
            Log.d(TAG, "connection started");

            sendEvent("onOpen", true);
        }

        @Override
        public void onMessage(WebSocket webSocket, String text) {
            super.onMessage(webSocket, text);

            Log.d(TAG, "onMessage: "+text);

            sendEvent("onMessage" , text);
        }

        @Override
        public void onMessage(WebSocket webSocket, ByteString bytes) {
            super.onMessage(webSocket, bytes);
        }

        @Override
        public void onClosing(WebSocket webSocket, int code, String reason) {
            super.onClosing(webSocket, code, reason);
            sendEvent("onClose" , "Error");
        }

        @Override
        public void onClosed(WebSocket webSocket, int code, String reason) {
            super.onClosed(webSocket, code, reason);
            sendEvent("onClose" , "Error");
        }

        @Override
        public void onFailure(WebSocket webSocket, Throwable t, @Nullable Response response) {
            super.onFailure(webSocket, t, response);
            sendEvent("onError" , t.getMessage());
        }
    }




}

