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

/**
 * Runtime Events
 */
public interface ChatServiceEvents {
    /**
     * New message received
     *
     * @param contents Message contents
     */
    public void onNewMessage(String contents);

    /**
     * A peer has been discovered.
     *
     * @param peer The discovered peer.
     * @param addrs Multiaddresses found for this peer.
     *
     */
    public void onPeerDiscovered(String peer, String[] addrs);

    /**
     * No route has been found to peer.
     *
     * @param peer The unroutable peer.
     */
    public void onPeerUnroutable(String peer);

    /**
     * Connection established to peer.
     *
     * @param peer The peer the connection was established to.
     * @param numEstablished The number of established connections to peer.
     */
    public void onConnectionEstablished(String peer, int numEstablished);

    /**
     * Connection to peer was closed
     *
     * @param peer The peer the connection was closed.
     * @param numEstablished Number of remaining connections.
     * @param cause The close cause if provided (not null).
     */
    public void onConnectionClosed(String peer, int numEstablished, String cause);

    /**
     * New incoming connection
     *
     * @param localAddr Our local address where the connection was received.
     * @param sendBackAddr The address we use to send back to this peer.
     */
    public void onIncomingConnection(String localAddr, String sendBackAddr);

    /**
     * Error ocurred on incoming connection.
     *
     * @param localAddr Our local address where the connection was received.
     * @param sendBackAddr The address we use to send back to this peer.
     * @param error The error cause.
     */
    public void onIncomingConnectionError(String localAddr, String sendBackAddr, String error);

    /**
     * A peer was banned
     *
     * @param peer The peer banned.
     */
    public void onBannedPeer(String peer);

    /**
     * Unreachable peer address
     *
     * @param peer The unreachable peer.
     * @param address The unreachable address for the given peer.
     * @param error The error cause.
     * @param attemptsRemaining Number of remaining attempts.
     */
    public void onUnreachableAddr(String peer, String address, String error, int attemptsRemaining);

    /**
     * Unreachable address to unknown peer
     *
     * @param address The unreachable address
     * @param error The error cause.
     */
    public void onUnknownPeerUnreachableAddr(String address, String error);

    /**
     * One of the listeners has reported a new local listening address
     *
     * @param address Listening address in Multiaddr format.
     */
    public void onNewListenAddr(String address);

    /**
     * A listening address has been expired.
     *
     * @param address Address that expired.
     */
    public void onExpiredListenAddr(String address);

    /**
     * A listener has been closed
     *
     * @param addresses The local addresses closed.
     */
    public void onListenerClosed(String[] addresses);

    /**
     * An error happened within a listener
     *
     * @param error The error string.
     */
    public void onListenerError(String error);

    /**
     * Dialing a peer
     *
     * @param peer The peer that is being dialed.
     */
    public void onDialing(String peer);
}
