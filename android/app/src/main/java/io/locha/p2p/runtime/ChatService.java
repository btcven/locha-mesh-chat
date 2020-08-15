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

    private static ChatService INSTANCE = null;

    private boolean isStarted;

    private ChatServiceEvents eventsHandler;

    private ChatService() {
        this.isStarted = false;
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
        Log.i("LochaP2P", "Setting events handler");

        if (!isStarted()) {
            throw new IllegalStateException("ChatService hasn't been started");
        }

        this.eventsHandler = eventsHandler;
    }

    /**
     * Start the server
     *
     * @throws RuntimeException if the server is already started.
     */
    public void start(byte[] privateKey) {
        Log.i("LochaP2P", "Starting ChatService");
        if (isStarted()) {
            return;
        }

        nativeStart(privateKey);

        this.isStarted = true;
    }

    public void stop() {
        nativeStop();
    }

    public boolean isRunning() {
        return nativeIsRunning();
    }

    /**
     * Has the Chat service already been started?
     */
    public boolean isStarted() {
        return this.isStarted;
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
        Log.i("LochaP2P", String.format("Dialing '%s'", multiaddr));
        nativeDial(multiaddr);
    }

    /**
     * Send a message
     *
     * @param contents The message contents.
     */
    public void sendMessage(String contents) {
        Log.i("LochaP2P", String.format("Sending message '%s'", contents));

        nativeSendMessage(contents);

        Log.i("LochaP2P", String.format("Message sent"));
    }

    public native void nativeStart(byte[] privateKey);
    public native void nativeStop();
    public native boolean nativeIsRunning();
    public native void nativeDial(String multiaddr);
    public native void nativeSendMessage(String contents);
}
