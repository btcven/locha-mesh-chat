// Copyright 2020 Locha Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::fmt;

use libp2p::identity::{secp256k1, Keypair};
use libp2p::{Multiaddr, PeerId};

pub struct ChatServiceConfig {
    pub secret_key: secp256k1::SecretKey,
    pub listen_addr: Multiaddr,
    pub channel_cap: usize,
    pub heartbeat_interval: u64,

    pub keypair: Keypair,
    pub peer_id: PeerId,
}

impl fmt::Debug for ChatServiceConfig {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("ChatServiceConfig")
            .field("secret_key", &"SecretKey(...)".to_string())
            .field("listen_addr", &self.listen_addr)
            .field("channel_cap", &self.channel_cap)
            .field("heartbeat_interval", &self.heartbeat_interval)
            .field("keypair", &"Keypair(...)".to_string())
            .field("peer_id", &self.peer_id)
            .finish()
    }
}
