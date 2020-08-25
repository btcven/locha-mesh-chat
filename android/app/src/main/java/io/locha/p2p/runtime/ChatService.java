/*
 * Copyright 2020 Locha Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.locha.p2p.runtime;

import io.locha.p2p.util.LibraryLoader;
import android.util.Log;

import com.facebook.react.bridge.Promise;

/**
 * Chat service. This class manages the chat logic, such as starting and
 * stopping the server.
 *
 * <p> TODO: this should not be a singleton, instead modify the Rust code to
 * work without globals and with various servers. That can help with mocking
 * and other things.
 */
public class ChatService {
    static {
        LibraryLoader.load();
    }

    private static String TAG = "LochaP2P";
    private static ChatService INSTANCE = null;

    private ChatServiceEvents eventsHandler;
    private String peerId;

    private ChatService() {
        this.eventsHandler = null;
    }

    /**
     * Get instance of the Chat service.
     */
    public static ChatService get() {
        if (INSTANCE == null) {
            INSTANCE = new ChatService();
        }

        return INSTANCE;
    }

    /**
     * Sets the handler for ChatService events
     * 
     * @throws IllegalStateException if ChatService is not started.
     */
    public void setEventsHandler(ChatServiceEvents eventsHandler) {
        Log.i(TAG, "Setting events handler");

        this.eventsHandler = eventsHandler;
        this.peerId = null;
    }

    /**
     * Start the server
     *
     * @throws RuntimeException if the server is already started.
     */
    public void start(byte[] privateKey, Promise promise) {
        Log.i(TAG, "Starting ChatService");
        if (isStarted()) {
            promise.reject("Error", "The chat service is already active");
            return;
        }
        nativeStart(privateKey);
        this.peerId = nativeGetPeerId();
        promise.resolve(this.peerId);
    }

    /**
     * @throws RuntimeException if not started.
     * @throws RuntimeException if an error ocurred while stopping ChatService.
     */
    public void stop() {
        nativeStop();
    }

    /**
     * Has the Chat service already been started?
     */
    public boolean isStarted() {
        return nativeIsStarted();
    }

    /**
     * Return the peer ID 
     */
    public String getPeerId() {
        return this.peerId;
    }

    /**
     * Dial (connect to) a peer.
     * 
     * @param multiaddr The peer address in Multiaddress format.
     *
     * @throws RuntimeException if the address is invalid.
     *
     * @see <a href="https://multiformats.io/multiaddr/">Multiaddr</a>
     */
    public void dial(String multiaddr) {
        Log.i(TAG, String.format("Dialing '%s'", multiaddr));
        nativeDial(multiaddr);
    }

    /**
     * Send a message
     *
     * @param contents The message contents.
     */
    public void sendMessage(String contents) {
        Log.i(TAG, String.format("Sending message '%s'", contents));

        nativeSendMessage(contents);

        Log.i(TAG, String.format("Message sent"));
    }

    public native void nativeStart(byte[] privateKey);
    public native void nativeStop();
    public native boolean nativeIsStarted();
    public native String nativeGetPeerId();
    public native void nativeDial(String multiaddr);
    public native void nativeSendMessage(String contents);
}
