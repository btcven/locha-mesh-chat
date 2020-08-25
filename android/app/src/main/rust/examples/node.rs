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

use std::time::{SystemTime, UNIX_EPOCH};
use std::io::{Read, Write};
use std::thread;

use futures::select;
use futures::prelude::*;

use async_std::task;
use async_std::sync::{channel, Sender};
use async_std::io::{self, BufReader, BufRead};

use libp2p::identity::{secp256k1, Keypair};
use libp2p::{Multiaddr, PeerId};
use libp2p::multihash::{Sha2_256, MultihashDigest};

use serde_derive::{Deserialize, Serialize};

use locha_p2p::runtime::{ChatService, ChatServiceConfig, ChatServiceEvents};

use log::info;

struct EventsHandler {
    channel: Sender<Message>
}

impl ChatServiceEvents for EventsHandler {
    fn on_new_message(&mut self, message: String) {
        info!("new message:\n{}", message);

        let mut message: Message = serde_json::from_str(message.as_str()).expect("Invalid message");

        let to_uid = message.from_uid.clone();
        let from_uid = message.to_uid.clone();

        message.to_uid = to_uid;
        message.from_uid = from_uid;

        message.timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();

        let mut hash_input = String::new();
        hash_input.push_str(message.from_uid.as_str());
        hash_input.push_str(message.to_uid.as_str());
        hash_input.push_str(message.msg.as_text());
        hash_input.push_str(message.timestamp.to_string().as_str());

        let mut hasher = Sha2_256::default();
        hasher.input(hash_input.as_bytes());
        message.msg_id = hex::encode(hasher.result().as_bytes());

        let handle = thread::spawn({
            let channel = self.channel.clone();

            move || {
                task::block_on(async {
                    channel.send(message).await
                })
            }
        });

        handle.join().unwrap()
    }

    fn on_new_listen_addr(&mut self, multiaddr: Multiaddr) {
        info!("new listen addr: {}", multiaddr)
    }
}

#[derive(Deserialize, Serialize)]
enum MessageContents {
    #[serde(rename = "text")]
    Text(String)
}

impl MessageContents {
    pub fn as_text(&mut self) -> &str {
        match *self {
            MessageContents::Text(ref t) => t.as_str(),
            _ => panic!("Not text message content"),
        }
    }
}

#[derive(Deserialize, Serialize)]
struct Message {
    #[serde(rename = "fromUID")]
    pub from_uid: String,
    #[serde(rename = "toUID")]
    pub to_uid: String,
    pub msg: MessageContents,
    pub timestamp: u64,
    #[serde(rename = "type")]
    pub _type: u64,
    #[serde(rename = "msgID")]
    pub msg_id: String,
}

fn main() {
    env_logger::init();

    let mut chat_service = ChatService::new();

    let secret_key = match std::fs::File::open("secret_key") {
        Ok(mut file) => {
            let mut secret_key = [0u8; 32];
            file.read(&mut secret_key).unwrap();
            secp256k1::SecretKey::from_bytes(secret_key).unwrap()
        },
        Err(e) => {
            let secret_key = secp256k1::SecretKey::generate();
            // Save generated secret key
            let mut file = std::fs::File::create("secret_key").unwrap();
            file.write(&secret_key.to_bytes()).unwrap();
            file.flush().unwrap();
            secret_key
        }
    };
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

    let (sender, receiver) = channel::<Message>(10);
    let events_handler = EventsHandler {
        channel: sender,
    };

    chat_service
        .start(config, Box::new(events_handler))
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

    let input = io::stdin();
    let channel = receiver;

    task::block_on(async move {
        loop {
            let mut line = String::new();
            select! {
                _ = input.read_line(&mut line).fuse() => {
                    if line == "exit\n" || line == "exit\r\n" || line == "exit\r" {
                        break;
                    }

                    chat_service
                        .send_message(line)
                        .expect("couldn't send message")
                }
                msg = channel.recv().fuse() => {
                    if let Ok(ref msg) = msg {
                        chat_service.send_message(serde_json::to_string(msg).unwrap())
                            .expect("couldn't send message")
                    }
                }
            }
        }

        chat_service.stop().expect("couldn't stop chat service")
    })
}
