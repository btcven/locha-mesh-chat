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

mod chat_service;
pub use chat_service::{ChatService, ChatServiceConfig, ChatServiceEvents};

use std::{panic, sync::Arc};

use jni::{
    objects::{GlobalRef, JClass, JString, JValue},
    signature::{JavaType, Primitive},
    sys::{jboolean, jbyteArray, jstring, JNI_FALSE, JNI_TRUE},
    Executor, JNIEnv,
};

use lazy_static::lazy_static;

use log::trace;
use parking_lot::RwLock;

use libp2p::identity::{secp256k1, Keypair};
use libp2p::{Multiaddr, PeerId};

use crate::util::{
    jni_cache::chat_service_events, unwrap_exc_or_default, unwrap_exc_or, unwrap_jni,
};
use crate::{JniError, JniErrorKind};

const CHAT_SERVICE_EVENTS_HANDLER_FIELD_TYPE: &str =
    "Lio/locha/p2p/runtime/ChatServiceEvents;";

lazy_static! {
    static ref CHAT_SERVICE: RwLock<ChatService> =
        RwLock::new(ChatService::new());
}

#[inline(always)]
fn java_msg_error<S: Into<String>>(msg: S) -> JniError {
    JniError::from_kind(JniErrorKind::Msg(msg.into()))
}

fn java_bytearray_to_secretkey(
    env: &JNIEnv<'_>,
    bytes: jbyteArray,
) -> Result<secp256k1::SecretKey, JniError> {
    env.convert_byte_array(bytes).and_then(|bytes| {
        secp256k1::SecretKey::from_bytes(bytes)
            .map_err(|e| java_msg_error(e.to_string()))
    })
}

fn java_get_events_handler_field(
    env: &JNIEnv<'_>,
    class: JClass,
) -> Result<GlobalRef, JniError> {
    let events_handler = env
        .get_field(
            class,
            "eventsHandler",
            CHAT_SERVICE_EVENTS_HANDLER_FIELD_TYPE,
        )
        .and_then(JValue::l)?;

    if events_handler.clone().into_inner() == 0 as jni::sys::jobject {
        return Err(java_msg_error("eventsHandler variable is null. Maybe you need\
                                  to set the handler before starting the service"));
    }

    env.new_global_ref(events_handler)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeStart(
    env: JNIEnv,
    class: JClass,
    secret_key: jbyteArray,
) {
    trace!("nativeStart");

    let res = panic::catch_unwind(|| {
        let mut chat_service = CHAT_SERVICE.write();

        let secret_key = java_bytearray_to_secretkey(&env, secret_key)?;
        let keypair =
            Keypair::Secp256k1(secp256k1::Keypair::from(secret_key.clone()));
        let peer_id = PeerId::from_public_key(keypair.public());

        let config = ChatServiceConfig {
            secret_key,
            listen_addr: "/ip4/0.0.0.0/tcp/0"
                .parse()
                .expect("invalid listen addr"),
            channel_cap: 20,
            heartbeat_interval: 10,
            keypair,
            peer_id,
        };

        let events_handler = java_get_events_handler_field(&env, class)?;
        let executor =
            env.get_java_vm().map(|vm| Executor::new(Arc::new(vm)))?;
        let events_proxy =
            ChatServiceEventsProxy::new(executor, events_handler);

        chat_service
            .start(config, Box::new(events_proxy))
            .expect("couldn't start chat service");

        Ok(())
    });

    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeStop(
    env: JNIEnv,
    _: JClass,
) {
    let res = panic::catch_unwind(|| {
        let mut chat_service = CHAT_SERVICE.write();
        chat_service.stop().expect("could not stop chat service");

        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeIsStarted(
    env: JNIEnv,
    _: JClass,
) -> jboolean {
    let res = panic::catch_unwind(|| {
        Ok(if CHAT_SERVICE.read().is_started() {
            JNI_TRUE
        } else {
            JNI_FALSE
        })
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeGetPeerId(
    env: JNIEnv,
    _: JClass,
) -> jstring {
    let res = panic::catch_unwind(|| {
        let chat_service = CHAT_SERVICE.read();

        env.new_string(chat_service.peer_id().to_string())
    });

    unwrap_exc_or(&env, res, env.new_string("").unwrap()).into_inner()
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_ChatService_nativeDial(
    env: JNIEnv,
    _: JClass,
    multiaddr: JString,
) {
    let res = panic::catch_unwind(|| {
        let multiaddr: String = env.get_string(multiaddr)?.into();
        let multiaddr: Multiaddr =
            multiaddr.parse().expect("invalid multiaddr");
        let chat_service = CHAT_SERVICE.read();
        chat_service
            .dial(multiaddr)
            .expect("could not dial address");

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
    trace!("nativeSendMessage");

    let res = panic::catch_unwind(|| {
        let chat_service = CHAT_SERVICE.read();
        let contents: String = env.get_string(contents)?.into();

        chat_service
            .send_message(contents)
            .expect("could not send message");
        Ok(())
    });
    unwrap_exc_or_default(&env, res)
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
}

impl ChatServiceEvents for ChatServiceEventsProxy {
    fn on_new_message(&mut self, message: String) {
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

    fn on_new_listen_addr(&mut self, multiaddr: Multiaddr) {
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
