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

//! # runtime
//!
//! This module contains the ChatService class JNI interface.

use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
    panic,
    str::FromStr,
    sync::Arc,
    thread,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use async_std::{
    sync::{channel, Sender},
    task,
};
use futures::{prelude::*, select};
use jni::{
    objects::{GlobalRef, JClass, JString, JValue},
    signature::{JavaType, Primitive},
    sys::{jboolean, jbyteArray, jstring, JNI_FALSE, JNI_TRUE},
    Executor, JNIEnv, JavaVM,
};
use lazy_static::lazy_static;

use libp2p::{
    self,
    core::{Multiaddr, PeerId},
    gossipsub::{
        protocol::MessageId, Gossipsub, GossipsubConfigBuilder, GossipsubEvent,
        GossipsubMessage, Topic,
    },
    identity::{secp256k1, Keypair},
    swarm::{Swarm, SwarmEvent},
};

use crate::util::{
    jni_cache::chat_service_events, unwrap_exc_or, unwrap_exc_or_default,
    unwrap_jni,
};
use parking_lot::{Condvar, Mutex, RwLock};

use log::{debug, error};

/// Chat service action
enum Action {
    SendMessage(Message),
    Dial(Multiaddr),
    Stop,
}

/// A chat message
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Message {
    /// Message contents.
    pub contents: String,
    /// Timestamp of the message since `UNIX_EPOCH`
    pub timestamp: u64,
}

// TODO: adjust
const CHANNEL_SIZE: usize = 25;
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(25);

const CHAT_SERVICE_EVENTS_HANDLER_FIELD_TYPE: &str =
    "Lio/locha/p2p/runtime/ChatServiceEvents;";

lazy_static! {
    static ref CHANNEL: RwLock<Option<Sender<Action>>> = RwLock::new(None);
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
enum StartStatus {
    NotStarted,
    Started,
    Failed,
}

#[derive(Debug, Clone)]
struct SyncStartCond {
    inner: Arc<(Mutex<StartStatus>, Condvar)>,
}

impl SyncStartCond {
    fn new() -> SyncStartCond {
        SyncStartCond {
            inner: Arc::new((
                Mutex::new(StartStatus::NotStarted),
                Condvar::new(),
            )),
        }
    }

    fn signal_start(&self, v: StartStatus) {
        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        match v {
            StartStatus::NotStarted => panic!("Can't send \"not started\" ;-)"),
            v => *started = v,
        }
        cvar.notify_one();
    }

    fn wait_for_start_status(self) -> StartStatus {
        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        match &*started {
            StartStatus::NotStarted => {
                cvar.wait(&mut started);
                match &*started {
                    StartStatus::NotStarted => unreachable!(),
                    s => *s,
                }
            }
            s => *s,
        }
    }
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeStart(
    env: JNIEnv,
    class: JClass,
    secret_key: jbyteArray,
) -> jstring {
    debug!("nativeStart");

    let res = panic::catch_unwind(|| -> Result<JString, jni::errors::Error> {
        if CHANNEL.read().is_some() {
            panic!("ChatService is already started");
        }

        let bytes = env.convert_byte_array(secret_key)?;
        let secret_key = secp256k1::SecretKey::from_bytes(bytes)
            .expect("Couldn't decode secret key bytes");
        let keypair = Keypair::Secp256k1(secret_key.into());
        let peer_id = PeerId::from_public_key(keypair.public());
        let output = env.new_string(peer_id.to_string())?;

        let vm = Arc::new(env.get_java_vm().expect("Couldn't get Java VM"));

        let events = env
            .get_field(
                class,
                "eventsHandler",
                CHAT_SERVICE_EVENTS_HANDLER_FIELD_TYPE,
            )
            .and_then(JValue::l)?;

        if events.clone().into_inner() == 0 as jni::sys::jobject {
            panic!(
                "eventsHandler variable is null. Maybe you need\
                to set the handler before starting the service"
            );
        }

        let events = env.new_global_ref(events)?;
        let events_proxy =
            ChatServiceEventsProxy::new(Executor::new(vm.clone()), events);

        let start_cond = SyncStartCond::new();

        // Spawn a thread for ChatService. Note: we can't use task::spawn
        // here because some jni-rs types are not Send safe.
        let start_cond_thread = start_cond.clone();
        thread::spawn(move || {
            chat_service_thread(vm, start_cond_thread, events_proxy, keypair)
        });

        // Wait for the start status of the thread we spaned.
        match start_cond.wait_for_start_status() {
            StartStatus::NotStarted => unreachable!(),
            StartStatus::Failed => {
                panic!("Couldn't start ChatService thread!");
            }
            StartStatus::Started => Ok(output),
        }
    });
    unwrap_exc_or(&env, res, env.new_string("").unwrap()).into_inner()
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeStop(
    env: JNIEnv,
    _: JClass,
) {
    let res = panic::catch_unwind(|| {
        send_action(Action::Stop);
        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeIsRunning(
    env: JNIEnv,
    _: JClass,
) -> jboolean {
    let res = panic::catch_unwind(|| {
        Ok(if CHANNEL.read().is_some() {
            JNI_TRUE
        } else {
            JNI_FALSE
        })
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeDial(
    env: JNIEnv,
    _: JClass,
    multiaddr: JString,
) {
    let res = panic::catch_unwind(|| {
        let multiaddr: String = env.get_string(multiaddr)?.into();
        let multiaddr =
            Multiaddr::from_str(&multiaddr).expect("Invalid Multiaddr!");
        send_action(Action::Dial(multiaddr));
        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeSendMessage(
    env: JNIEnv,
    _: JClass,
    contents: JString,
) {
    let res = panic::catch_unwind(|| {
        if CHANNEL.read().is_some() {
            error!("ChatService has not been started!");
            return Ok(());
        }
        let contents: String = env.get_string(contents)?.into();
        let message = Message {
            contents,
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        };
        send_action(Action::SendMessage(message));
        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

fn chat_service_thread(
    vm: Arc<JavaVM>,
    start_cond: SyncStartCond,
    events: ChatServiceEventsProxy,
    keypair: Keypair,
) {
    let _guard = vm.attach_current_thread().expect("Coudln't attach thread");

    // Run the ChatService task, handles the libp2p events and Java events.
    task::block_on(async move {
        chat_service_task(events, start_cond, keypair).await
    });
}

#[allow(unreachable_code)]
async fn chat_service_task<'a>(
    events: ChatServiceEventsProxy,
    start_cond: SyncStartCond,
    keypair: Keypair,
) {
    if CHANNEL.read().is_some() {
        error!("Can't start the Chat Service again!");
        return;
    }

    // Initialize the Actions channel. This tells the task what actions to
    // take depending on what the Java code wants.
    let (sender, receiver) = channel::<Action>(CHANNEL_SIZE);
    *CHANNEL.write() = Some(sender);

    let peer_id = PeerId::from(keypair.public());

    // TODO: build our own transport, that works anywhere with anything.
    // Also we should consider contributing to libp2p for a QUIC or UDP
    // transport for reliability.
    //
    // Set up an encrypted TCP Transport over the Mplex and Yamux protocols
    let transport = match libp2p::build_development_transport(keypair.clone()) {
        Ok(t) => t,
        Err(e) => {
            error!("Could not create development transport for libp2p: {}", e);
            start_cond.signal_start(StartStatus::Failed);
            return;
        }
    };

    // Create a Gossipsub topic
    let topic = Topic::new("locha-p2p-testnet".into());

    // set custom gossipsub
    let gossipsub_config = GossipsubConfigBuilder::new()
        .heartbeat_interval(HEARTBEAT_INTERVAL)
        .message_id_fn(craft_message_id)
        .build();

    let mut gossipsub = Gossipsub::new(peer_id.clone(), gossipsub_config);
    gossipsub.subscribe(topic.clone());

    let mut swarm = Swarm::new(transport, gossipsub, peer_id.clone());

    let listen_addr: Multiaddr = "/ip6/::/tcp/45293".parse().unwrap();
    match Swarm::listen_on(&mut swarm, listen_addr.clone()) {
        Ok(_) => (),
        Err(e) => {
            error!("Could not listen on {}: {}", listen_addr, e);
            start_cond.signal_start(StartStatus::Failed);
            return;
        }
    }

    // Signal the thread that spawned us that initialization is done
    // and we're ready to receive events from Java and/or the network.
    start_cond.signal_start(StartStatus::Started);

    loop {
        select! {
            recv = receiver.recv().fuse() => {
                let action = match recv {
                    Ok(v) => v,
                    Err(_) => {
                        // Sender has been dropped miracously, should never happen
                        break;
                    },
                };

                match action {
                    Action::Stop => break,
                    Action::Dial(to_dial) => {
                        match Swarm::dial_addr(&mut swarm, to_dial.clone()) {
                            Ok(_) => (),
                            Err(e) => {
                                error!("Dial to address {} failed: {}", to_dial, e);
                            }
                        }
                    }
                    Action::SendMessage(message) => {
                        swarm.publish(&topic, message.contents.as_bytes());
                    }
                }
            },
            event = swarm.next_event().fuse() => {
                match event {
                    SwarmEvent::Behaviour(behaviour) => {
                        match behaviour {
                            GossipsubEvent::Message(_peer_id, _id, message) => {
                                let contents = String::from_utf8_lossy(message.data.as_slice()).into_owned();
                                events.on_new_messsage(contents);
                            }
                            _ => (),
                        }
                    },
                    SwarmEvent::NewListenAddr(multiaddr) => events.on_new_listen_addr(multiaddr),
                    // TODO: implement other variants and handle them on the Java side
                    _ => (),
                }
            }
        }
    }

    // Cleanup the channel
    *CHANNEL.write() = None;
}

/// Create a `MessageId` from the message content by hashing it.
///
/// TODO: review this code for message integrity, it is not required
/// but should be taken in consideration.
///
/// TODO: Keep in mind that message IDs should be unique, so a message
/// that is equal to another might have the same ID, although, this can
/// collide with other peers message and might get discarded. Adding a
/// timestamp and/or the PeerId binary value should do the trick.
fn craft_message_id(message: &GossipsubMessage) -> MessageId {
    let mut s = DefaultHasher::new();
    message.data.hash(&mut s);
    MessageId(s.finish().to_string())
}

fn send_action(action: Action) {
    task::block_on(CHANNEL.read().as_ref().unwrap().send(action))
}

// An interface to the ChatService class
pub struct ChatServiceEventsProxy {
    exec: Executor,
    events: GlobalRef,
}

impl ChatServiceEventsProxy {
    pub fn new(exec: Executor, events: GlobalRef) -> ChatServiceEventsProxy {
        ChatServiceEventsProxy { exec, events }
    }

    pub fn on_new_messsage(&self, message: String) {
        unwrap_jni(self.exec.with_attached(|env| {
            let contents = env
                .new_string(message)
                .expect("Couldn't create Java String");

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_new_message_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(contents)],
            )
            .and_then(JValue::v)
        }))
    }

    pub fn on_new_listen_addr(&self, multiaddr: Multiaddr) {
        unwrap_jni(self.exec.with_attached(|env| {
            let multiaddr = env
                .new_string(multiaddr.to_string())
                .expect("Couldn't create Java string");

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_new_listen_addr_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(multiaddr)],
            )
            .and_then(JValue::v)
        }))
    }
}
