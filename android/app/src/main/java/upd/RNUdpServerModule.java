package upd;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import javax.annotation.Nonnull;

public class RNUdpServerModule  extends ReactContextBaseJavaModule  {

    private final static int port = 8888;
    private final static String TAG = "upd server";
    private static final int DEFAULT_MAX_RESOURCE_SIZE = 5 * 1024 * 1024;
    Thread UDPBroadcastThread;
    DatagramSocket udpServer;
    Boolean shouldRestartSocketListen = false;

    ReactApplicationContext context;
    public RNUdpServerModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        context = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "RBUdpServer";
    }


    @ReactMethod
    public void initServer(String url){
        shouldRestartSocketListen = true;
        UDPBroadcastThread = new Thread(new Runnable() {
            public void run() {
                try {

                    while (shouldRestartSocketListen) {
                        start(url);
                    }
                    //if (!shouldListenForUDPBroadcast) throw new ThreadDeath();
                } catch (Exception e) {
                    Log.i("UDP", "no longer listening for UDP broadcasts cause of error " + e.getMessage());
                }
            }
        });
        UDPBroadcastThread.start();
    }

    public void displayPacketDetails(DatagramPacket packet) {
        byte[] msgBuffer = packet.getData();
        int length = packet.getLength();
        int offset = packet.getOffset();

        int remotePort = packet.getPort();
        InetAddress remoteAddr = packet.getAddress();
        String msg = new String(msgBuffer, offset, length);

        System.out.println("Received a  packet:[IP Address=" + remoteAddr
                + ", port=" + remotePort + ", message=" + msg + "]");

        sendEvent("onMessage", msg);
    }


    private void sendEvent (String eventName , Object params) {
      Log.i("execute event", "HEREEEEEEEEEEEE");
      if (context.hasActiveCatalystInstance()) {
          context
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit(eventName, params);
      }
    }

    public void start(String url) {

        try {

            if(udpServer == null || udpServer.isClosed()){
                udpServer = new DatagramSocket(
                        port,
                        InetAddress.getByName(url)
                );
            }

            Log.i(TAG, "Created UDP  server socket at " + udpServer.getLocalSocketAddress());

            Log.i(TAG, "Waiting for a UDP packet...");
            DatagramPacket packet = new DatagramPacket(new byte[DEFAULT_MAX_RESOURCE_SIZE], DEFAULT_MAX_RESOURCE_SIZE);
            udpServer.receive(packet);


            udpServer.setBroadcast(true);
            displayPacketDetails(packet);
            udpServer.close();

        } catch (SocketException e) {
            Log.e(TAG, "Error: " + e.toString());
        } catch (UnknownHostException e) {
            Log.e(TAG, "Error: " + e.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    @ReactMethod
    void stopListen() {
        shouldRestartSocketListen = false;
        udpServer.close();
    }


    @ReactMethod
    public void send(String message ,  String url ) {
        Thread UDPSendThread = new Thread(new Runnable() {
            public void run() {
                try {

                    DatagramPacket datagramPacket = null;
                    System.out.println("Send a  packet:[IP Address=" + url
                            + ", port=" + port + ", message=" + message + "]");
                    try {
                        datagramPacket = new DatagramPacket(
                                message.getBytes(),
                                message.length(),
                                InetAddress.getByName(url),
                                port
                        );

                        udpServer.send(datagramPacket);
                    } catch (UnknownHostException e) {
                        Log.e("Error ", e.toString());
                    } catch (IOException e) {
                        Log.e("Error", e.toString());
                    }
                } catch (Exception e) {
                    Log.i("UDP", "no longer listening for UDP broadcasts cause of error " + e.getMessage());
                }
            }
        });
        if(!UDPSendThread.isAlive()){
            UDPSendThread.start();
        }

    }
}
