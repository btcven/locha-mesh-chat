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

use std::io::{Read, Write};
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};

use clap::{crate_authors, crate_version, value_t, values_t, App, Arg};

use futures::prelude::*;
use futures::select;

use async_std::io;
use async_std::sync::{channel, Sender};
use async_std::task;

use libp2p::identity::{secp256k1, Keypair};
use libp2p::multihash::{MultihashDigest, Sha2_256};
use libp2p::{Multiaddr, PeerId};

use serde_derive::{Deserialize, Serialize};

use locha_p2p::runtime::{ChatService, ChatServiceConfig, ChatServiceEvents};

use log::{error, info, trace};

struct EventsHandler {
    channel: Sender<Message>,
    echo: bool,
}

impl EventsHandler {
    fn send_echo(&self, message: String) {
        let mut message: Message = match serde_json::from_str(message.as_str())
        {
            Ok(m) => m,
            Err(_) => {
                trace!("not json message, --echo is enabled");
                return;
            }
        };

        let to_uid = message.from_uid.clone();
        let from_uid = message.to_uid.clone();

        message.to_uid = to_uid;
        message.from_uid = from_uid;

        message.timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let mut hash_input = String::new();
        hash_input.push_str(message.from_uid.as_str());
        hash_input.push_str(message.to_uid.as_str());
        hash_input.push_str(message.msg.as_text());
        hash_input.push_str(message.timestamp.to_string().as_str());

        let mut hasher = Sha2_256::default();
        hasher.input(hash_input.as_bytes());
        message.msg_id = hex::encode(hasher.result().as_bytes());

        // TODO: why i can't use block_on inside a block_on :thinking:
        let handle = thread::spawn({
            let channel = self.channel.clone();

            move || task::block_on(async { channel.send(message).await })
        });

        handle.join().unwrap()
    }
}

impl ChatServiceEvents for EventsHandler {
    fn on_new_message(&mut self, message: String) {
        info!("new message:\n{}", message);

        if self.echo {
            self.send_echo(message);
        }
    }

    fn on_new_listen_addr(&mut self, multiaddr: Multiaddr) {
        info!("new listen addr: {}", multiaddr)
    }
}

#[derive(Deserialize, Serialize)]
enum MessageContents {
    #[serde(rename = "text")]
    Text(String),
}

impl MessageContents {
    #[allow(unreachable_patterns)]
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
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Info)
        .init();

    let matches = App::new("Locha P2P Chat Node")
        .version(crate_version!())
        .author(crate_authors!())
        .about("Bootstrap node for Locha P2P")
        .arg(Arg::with_name("listen-addr")
                .short("l")
                .long("listen-addr")
                .value_name("multiaddr")
                .help("The address where the node will listen for incoming connections")
                .default_value("/ip4/0.0.0.0/tcp/0"))
        .arg(Arg::with_name("dial")
                .short("d")
                .long("dial")
                .value_name("multiaddr")
                .help("Dial a peer using it's multiaddr"))
        .arg(Arg::with_name("echo")
                .short("e")
                .long("echo")
                .help("Enable Locha P2P Chat echo testing"))
        .get_matches();

    let listen_addr = value_t!(matches.value_of("listen-addr"), Multiaddr)
        .unwrap_or_else(|e| e.exit());

    let mut chat_service = ChatService::new();

    let secret_key = match std::fs::File::open("secret_key") {
        Ok(mut file) => {
            let mut secret_key = [0u8; 32];
            file.read(&mut secret_key).unwrap();
            secp256k1::SecretKey::from_bytes(secret_key).unwrap()
        }
        Err(_) => {
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
        listen_addr,
        keypair,
        peer_id,
    };

    let (sender, receiver) = channel::<Message>(10);
    let events_handler = EventsHandler {
        channel: sender,
        echo: matches.is_present("echo"),
    };

    chat_service
        .start(config, Box::new(events_handler))
        .expect("couldn't start chat service");

    // Reach out to another node if specified
    let dials = values_t!(matches.values_of("dial"), Multiaddr);
    match dials {
        Ok(dials) => {
            for to_dial in dials {
                chat_service.dial(to_dial).expect("couldn't dial peer");
            }
        }
        Err(e) if e.kind == clap::ErrorKind::ArgumentNotFound => (),
        Err(e) => {
            error!("falied to parse address to dial: {}", e);
            return;
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
