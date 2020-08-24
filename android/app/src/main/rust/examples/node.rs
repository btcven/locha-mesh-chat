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

use std::io::{self, BufRead, BufReader};

use libp2p::identity::{secp256k1, Keypair};
use libp2p::{Multiaddr, PeerId};

use locha_p2p::runtime::{ChatService, ChatServiceConfig, ChatServiceEvents};

use log::info;

struct EventsHandler;

impl ChatServiceEvents for EventsHandler {
    fn on_new_message(&mut self, message: String) {
        info!("new message:\n{}", message);
    }

    fn on_new_listen_addr(&mut self, multiaddr: Multiaddr) {
        info!("new listen addr: {}", multiaddr)
    }
}

fn main() {
    env_logger::init();

    let mut chat_service = ChatService::new();

    let secret_key = secp256k1::SecretKey::generate();
    let keypair = Keypair::Secp256k1(secret_key.clone().into());
    let peer_id = PeerId::from_public_key(keypair.public());

    info!("our peer id: {}", peer_id);

    let config = ChatServiceConfig {
        secret_key,
        channel_cap: 25,
        heartbeat_interval: 10,
        listen_addr: "/ip4/0.0.0.0/tcp/0".parse().expect("invalid listen addr"),
        keypair,
        peer_id,
    };

    chat_service
        .start(config, Box::new(EventsHandler))
        .expect("couldn't start chat service");

    // Reach out to another node if specified
    if let Some(to_dial) = std::env::args().nth(1) {
        match to_dial.parse() {
            Ok(to_dial) => {
                chat_service.dial(to_dial).expect("couldn't dial peer")
            }
            Err(err) => println!("Failed to parse address to dial: {:?}", err),
        }
    }

    let stdin = io::stdin();
    let mut input = BufReader::new(stdin.lock());

    loop {
        let mut line = String::new();
        input.read_line(&mut line).expect("could not read line");
        if line == "exit\n" || line == "exit\r\n" || line == "exit\r" {
            break;
        }

        chat_service
            .send_message(line)
            .expect("couldn't send message")
    }

    chat_service.stop().expect("couldn't stop chat service")
}
