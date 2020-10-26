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
public interface RuntimeEvents {
    /**
     * New message received
     *
     * @param peerId The originator peer ID.
     * @param contents Message contents.
     */
    void onNewMessage(String peerId, String contents);

    /**
     * Connection established to peer.
     *
     * @param peer The peer the connection was established to.
     * @param numEstablished The number of established connections to peer.
     */
    void onConnectionEstablished(String peer, int numEstablished);

    /**
     * Connection to peer was closed
     *
     * @param peer The peer the connection was closed.
     * @param numEstablished Number of remaining connections.
     * @param cause The close cause if provided (not null).
     */
    void onConnectionClosed(String peer, int numEstablished, String cause);

    /**
     * New incoming connection
     *
     * @param localAddr Our local address where the connection was received.
     * @param sendBackAddr The address we use to send back to this peer.
     */
    void onIncomingConnection(String localAddr, String sendBackAddr);

    /**
     * Error ocurred on incoming connection.
     *
     * @param localAddr Our local address where the connection was received.
     * @param sendBackAddr The address we use to send back to this peer.
     * @param error The error cause.
     */
    void onIncomingConnectionError(String localAddr, String sendBackAddr, String error);

    /**
     * A peer was banned
     *
     * @param peer The peer banned.
     */
    void onBannedPeer(String peer);

    /**
     * Unreachable peer address
     *
     * @param peer The unreachable peer.
     * @param address The unreachable address for the given peer.
     * @param error The error cause.
     * @param attemptsRemaining Number of remaining attempts.
     */
    void onUnreachableAddr(String peer, String address, String error, int attemptsRemaining);

    /**
     * Unreachable address to unknown peer
     *
     * @param address The unreachable address
     * @param error The error cause.
     */
    void onUnknownPeerUnreachableAddr(String address, String error);

    /**
     * One of the listeners has reported a new local listening address
     *
     * @param address Listening address in Multiaddr format.
     */
    void onNewListenAddr(String address);

    /**
     * A listening address has been expired.
     *
     * @param address Address that expired.
     */
    void onExpiredListenAddr(String address);

    /**
     * A listener has been closed
     *
     * @param addresses The local addresses closed.
     */
    void onListenerClosed(String[] addresses);

    /**
     * An error happened within a listener
     *
     * @param error The error string.
     */
    void onListenerError(String error);

    /**
     * Dialing a peer
     *
     * @param peer The peer that is being dialed.
     */
    void onDialing(String peer);

}
