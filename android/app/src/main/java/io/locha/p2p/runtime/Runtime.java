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
import androidx.annotation.NonNull;
import android.util.Log;

/**
 * The Runtime.
 */
public class Runtime {
    static {
        LibraryLoader.load();
    }

    /**
     * This field is accessed by Rust JNI to report events. It MUST not be null
     * when nativeStart() is called, otherwise a RuntimeException will be thrown.
     */
        private RuntimeEvents eventsHandler;
    /**
     * Rust Runtime handle, it's initialized on the constructor by nativeNew function.
     */
    private long handle;

    private static Runtime INSTANCE = null;

    private Runtime() {
        this.eventsHandler = null;
        this.handle = 0;
    }

    /**
     * Construct a Runtime
     *
     * @param eventsHandler The runtime events handler.
     * @param secretKey The secret key used to construct our identity, it SHOULD be
     * a 32-byte secpk256k1 secret key.
     * @param attemptUpnp Whether to enable UPnP and attempt to use it to discover
     * our external IP address and do port mapping.
     *
     * @throws RuntimeException on invalid parameters.
     */
    public void start(@NonNull RuntimeEvents eventsHandler,
                         byte[] secretKey,
                         boolean attemptUpnp, String address) throws RuntimeException {
        if (handle != 0) {
            throw new RuntimeException("Runtime is already started");
        }

        this.eventsHandler = eventsHandler;
        this.handle = 0;

        nativeNew(secretKey, attemptUpnp, address);
    }

    public static Runtime getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new Runtime();
        }

        return INSTANCE;
    }

    public static boolean isStarted() {
        if (INSTANCE == null) {
            return false;
        } else {
            return INSTANCE.handle != 0;
        }
    }

    /**
     * Destroy the Runtime. After calling this method this object is no longer valid!
     *
     * @throws RuntimeException if stop() has been called before.
     */
    public void stop() throws RuntimeException {
        nativeStop();

        this.handle = 0;
        this.eventsHandler = null;
    }

    /**
     * Get a list of our observed external addresses.
     *
     * @return Array of our external addresses in multi-addr format.
     *
     * @throws RuntimeException if stop() has been called before.
     */
    public String[] externalAddresses() throws RuntimeException {
        return nativeExternalAddresses();
    }

    /**
     * @return Returns our Peer ID as an String.
     *
     * @throws RuntimeException if stop() has been called before.
     */
    public String getPeerId() throws RuntimeException {
        return nativeGetPeerId();
    }

    /**
     * Dial a peer using it's address
     *
     * @param multiaddr Address in multiaddress format.
     *
     * @throws RuntimeException if stop() has been called before.
     */
    public void dial(String multiaddr) throws RuntimeException {
        nativeDial(multiaddr);
    }

    /**
     * Send a message with the given content
     *
     * @param contents The message contents.
     *
     * @throws RuntimeException if stop() has been called before.
     */
    public void sendMessage(String contents) throws RuntimeException {
        nativeSendMessage(contents);
    }



    public void setNewAddressListen(String address){
        nativeNewAddressListen(address);
    }

    private native void nativeNew(byte[] privateKey, boolean attemptUpnp, String address);
    private native void nativeStop();
    private native String[] nativeExternalAddresses();
    private native String nativeGetPeerId();
    private native void nativeDial(String multiaddr);
    private native void nativeSendMessage(String contents);
    private native void nativeNewAddressListen(String address);
}
