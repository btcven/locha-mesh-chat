package upd;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
    public void initServer(){
        shouldRestartSocketListen = true;
        UDPBroadcastThread = new Thread(new Runnable() {
            public void run() {
                try {

                    while (shouldRestartSocketListen) {
                        start();
                    }
                    //if (!shouldListenForUDPBroadcast) throw new ThreadDeath();
                } catch (Exception e) {
                    Log.i("UDP", "no longer listening for UDP broadcasts cause of error " + e.getMessage());
                }
            }
        });
        UDPBroadcastThread.start();
    }

    public static void displayPacketDetails(DatagramPacket packet) {
        byte[] msgBuffer = packet.getData();
        int length = packet.getLength();
        int offset = packet.getOffset();

        int remotePort = packet.getPort();
        InetAddress remoteAddr = packet.getAddress();
        String msg = new String(msgBuffer, offset, length);

        System.out.println("Received a  packet:[IP Address=" + remoteAddr
                + ", port=" + remotePort + ", message=" + msg + "]");
    }


    public void start() {
        final String url = "[2001:db8::8d55:c1dd:1210:5097]";

        try {

            if(udpServer == null || udpServer.isClosed()){
                udpServer = new DatagramSocket(
                        port,
                        InetAddress.getByName(url)
                );
            }

            Log.i(TAG, "Created UDP  server socket at " + udpServer.getLocalSocketAddress());

                Log.i(TAG, "Waiting for a UDP packet...");
                DatagramPacket packet = new DatagramPacket(new byte[1024], 1024);
                udpServer.receive(packet);


                udpServer.setBroadcast(true);
                displayPacketDetails(packet);


                udpServer.close();


        } catch (SocketException e) {
            Log.e(TAG, "Error: "+ e.toString());
        } catch (UnknownHostException e) {
            Log.e(TAG, "Error: "+ e.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    void stopListen() {
        shouldRestartSocketListen = false;
        udpServer.close();
    }


    @ReactMethod
    public void send(String message ,  String url ) throws IOException {
        Log.i(TAG, "EXECUTE EL SEND");
        String aqui = "el webo mio";
        DatagramPacket datagramPacket = new DatagramPacket(
                message.getBytes(),
                message.length(),
                InetAddress.getByName(url),
                port
        );

        udpServer.send(datagramPacket);
    }
}
