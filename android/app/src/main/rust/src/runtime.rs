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
//! This module contains the Runtime class JNI interface.

use std::num::NonZeroU32;
use std::{io, panic, sync::Arc};

use jni::objects::{GlobalRef, JClass, JObject, JString, JValue};
use jni::signature::{JavaType, Primitive};
use jni::sys::{jboolean, jbyteArray, jobject, jstring, JNI_TRUE};
use jni::{Executor, JNIEnv};

use log::trace;

use async_std::task;

use libp2p::core::connection::PendingConnectionError;
use libp2p::core::ConnectedPoint;
use libp2p::identity::secp256k1;

use locha_p2p::discovery::DiscoveryConfig;
use locha_p2p::identity::Identity;
use locha_p2p::runtime::config::RuntimeConfig;
use locha_p2p::runtime::events::RuntimeEvents;
use locha_p2p::runtime::Runtime;
use locha_p2p::{Multiaddr, PeerId};

use crate::util::jni_cache::{chat_service_events, classes_refs};
use crate::util::{unwrap_exc_or, unwrap_exc_or_default, unwrap_jni};
use crate::{JniError, JniErrorKind};

const CHAT_SERVICE_EVENTS_HANDLER_FIELD_TYPE: &str =
    "Lio/locha/p2p/runtime/RuntimeEvents;";

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
        return Err(java_msg_error(
            "eventsHandler variable is null. Maybe you need\
                                  to set the handler before starting the service",
        ));
    }

    env.new_global_ref(events_handler)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeNew(
    env: JNIEnv,
    class: JClass,
    secret_key: jbyteArray,
    attempt_upnp: jboolean,
) {
    trace!("nativeStart");

    let res = panic::catch_unwind(|| {
        let secret_key = java_bytearray_to_secretkey(&env, secret_key)?;
        let identity = Identity::from(secret_key);
        let attempt_upnp = attempt_upnp == JNI_TRUE;

        let mut discovery = DiscoveryConfig::new();

        discovery
            .use_mdns(true)
            .id(identity.id())
            .allow_ipv4_private(false)
            .allow_ipv4_shared(false)
            .allow_ipv6_link_local(false)
            .allow_ipv6_ula(true);

        let config = RuntimeConfig {
            identity,
            listen_addr: "/ip4/0.0.0.0/tcp/4444"
                .parse()
                .expect("invalid listen addr"),
            channel_cap: 20,
            heartbeat_interval: 10,

            discovery,
        };

        let events_handler = java_get_events_handler_field(&env, class)?;
        let executor =
            env.get_java_vm().map(|vm| Executor::new(Arc::new(vm)))?;
        let events_proxy =
            Box::new(RuntimeEventsProxy::new(executor, events_handler));

        let (runtime, runtime_task) =
            Runtime::new(config, events_proxy, attempt_upnp).unwrap();

        task::spawn(runtime_task);

        env.set_rust_field(class, "handle", runtime)?;

        Ok(())
    });

    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeStop(
    env: JNIEnv,
    class: JClass,
) {
    let res = panic::catch_unwind(|| {
        let runtime: Runtime = env.take_rust_field(class, "handle")?;
        task::block_on(runtime.stop());
        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeExternalAddresses(
    env: JNIEnv,
    class: JClass,
) -> jobject {
    let res = panic::catch_unwind(|| {
        let runtime = env.get_rust_field::<_, _, Runtime>(class, "handle")?;
        let addrs = task::block_on(runtime.external_addresses());
        rust_slice_to_java_string_array(&env, addrs.as_slice())
    });

    unwrap_exc_or(&env, res, JObject::null()).into_inner()
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeGetPeerId(
    env: JNIEnv,
    class: JClass,
) -> jstring {
    let res = panic::catch_unwind(|| {
        let runtime = env.get_rust_field::<_, _, Runtime>(class, "handle")?;
        let peer_id = task::block_on(runtime.peer_id());
        env.new_string(peer_id.to_string())
    });

    unwrap_exc_or(&env, res, env.new_string("").unwrap()).into_inner()
}


#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeNewAddressListen(
  env: JNIEnv,
  class: JClass,
  address: JString,
) {

  let input: String = env.get_string(address)                                  
  .expect("Couldn't get java string!")                                   
  .into();                                                               

   trace!("nativeNewAddressListen: {}", input)

   
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeDial(
    env: JNIEnv,
    class: JClass,
    multiaddr: JString,
) {
    let res = panic::catch_unwind(|| {
        let runtime = env.get_rust_field::<_, _, Runtime>(class, "handle")?;

        let multiaddr: String = env.get_string(multiaddr)?.into();
        let multiaddr: Multiaddr =
            multiaddr.parse().expect("invalid multiaddr");

        task::block_on(runtime.dial(multiaddr));

        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_runtime_Runtime_nativeSendMessage(
    env: JNIEnv,
    class: JClass,
    contents: JString,
) {
    trace!("nativeSendMessage");

    let res = panic::catch_unwind(|| {
        let runtime = env.get_rust_field::<_, _, Runtime>(class, "handle")?;
        let contents: String = env.get_string(contents)?.into();
        task::block_on(runtime.send_message(contents));
        Ok(())
    });
    unwrap_exc_or_default(&env, res)
}

// An interface to the RuntimeEvents class
pub struct RuntimeEventsProxy {
    exec: Executor,
    events: GlobalRef,
}

impl RuntimeEventsProxy {
    pub fn new(exec: Executor, events: GlobalRef) -> RuntimeEventsProxy {
        RuntimeEventsProxy { exec, events }
    }
}

impl RuntimeEvents for RuntimeEventsProxy {
    fn on_new_message(&mut self, message: String) {
        unwrap_jni(self.exec.with_attached(|env| {
            let contents = env.new_string(message)?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_new_message_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(contents)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_peer_discovered(&mut self, peer: &PeerId, addrs: Vec<Multiaddr>) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;
            let addrs = rust_slice_to_java_string_array(env, addrs.as_slice())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_peer_discovered_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(peer), JValue::from(addrs)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_peer_unroutable(&mut self, peer: &PeerId) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_peer_unroutable_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(peer)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_connection_established(
        &mut self,
        peer: &PeerId,
        _: &ConnectedPoint,
        num_established: NonZeroU32,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_connection_established_id(),
                JavaType::Primitive(Primitive::Void),
                &[
                    JValue::from(peer),
                    JValue::Int(num_established.get() as i32),
                ],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_connection_closed(
        &mut self,
        peer: &PeerId,
        _: &ConnectedPoint,
        num_established: u32,
        cause: Option<String>,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;
            let cause: JValue = if let Some(c) = cause {
                env.new_string(c)?.into()
            } else {
                JObject::null().into()
            };

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_connection_closed_id(),
                JavaType::Primitive(Primitive::Void),
                &[
                    JValue::from(peer),
                    JValue::Int(num_established as i32),
                    cause,
                ],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_incomming_connection(
        &mut self,
        local_addr: &Multiaddr,
        send_back_addr: &Multiaddr,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let local_addr = env.new_string(local_addr.to_string())?;
            let send_back_addr = env.new_string(send_back_addr.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_incoming_connection_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(local_addr), JValue::from(send_back_addr)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_incomming_connection_error(
        &mut self,
        local_addr: &Multiaddr,
        send_back_addr: &Multiaddr,
        error: &PendingConnectionError<io::Error>,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let local_addr = env.new_string(local_addr.to_string())?;
            let send_back_addr = env.new_string(send_back_addr.to_string())?;
            let error = env.new_string(error.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_incoming_connection_error_id(),
                JavaType::Primitive(Primitive::Void),
                &[
                    JValue::from(local_addr),
                    JValue::from(send_back_addr),
                    JValue::from(error),
                ],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_banned_peer(&mut self, peer: &PeerId, _: &ConnectedPoint) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_banned_peer_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(peer)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_unreachable_addr(
        &mut self,
        peer: &PeerId,
        address: &Multiaddr,
        error: &PendingConnectionError<io::Error>,
        attempts_remaining: u32,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;
            let address = env.new_string(address.to_string())?;
            let error = env.new_string(error.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_unreachable_addr_id(),
                JavaType::Primitive(Primitive::Void),
                &[
                    JValue::from(peer),
                    JValue::from(address),
                    JValue::from(error),
                    JValue::Int(attempts_remaining as i32),
                ],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_unknown_peer_unreachable_addr(
        &mut self,
        address: &Multiaddr,
        error: &PendingConnectionError<io::Error>,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let address = env.new_string(address.to_string())?;
            let error = env.new_string(error.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_unknown_peer_unreachable_addr_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(address), JValue::from(error)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_new_listen_addr(&mut self, multiaddr: &Multiaddr) {
        unwrap_jni(self.exec.with_attached(|env| {
            let multiaddr = env.new_string(multiaddr.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_new_listen_addr_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(multiaddr)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_expired_listen_addr(&mut self, address: &Multiaddr) {
        unwrap_jni(self.exec.with_attached(|env| {
            let address = env.new_string(address.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_expired_listen_addr_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(address)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_listener_closed(
        &mut self,
        addresses: &[Multiaddr],
        reason: &Result<(), io::Error>,
    ) {
        unwrap_jni(self.exec.with_attached(|env| {
            let addresses = rust_slice_to_java_string_array(&env, addresses)?;
            let reason: JValue = match reason {
                Ok(_) => JObject::null().into(),
                Err(e) => env.new_string(e.to_string())?.into(),
            };

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_listener_error_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(addresses), reason],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_listener_error(&mut self, error: &io::Error) {
        unwrap_jni(self.exec.with_attached(|env| {
            let error = env.new_string(error.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_listener_error_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(error)],
            )
            .and_then(JValue::v)
        }))
    }

    fn on_dialing(&mut self, peer: &PeerId) {
        unwrap_jni(self.exec.with_attached(|env| {
            let peer = env.new_string(peer.to_string())?;

            env.call_method_unchecked(
                self.events.as_obj(),
                chat_service_events::on_dialing_id(),
                JavaType::Primitive(Primitive::Void),
                &[JValue::from(peer)],
            )
            .and_then(JValue::v)
        }))
    }
}

fn rust_slice_to_java_string_array<'a, T: ToString>(
    env: &'a JNIEnv<'a>,
    slice: &[T],
) -> Result<JObject<'a>, JniError> {
    assert!(slice.len() <= i32::MAX as usize);

    let arr = env.new_object_array(
        slice.len() as i32,
        &classes_refs::java_lang_string(),
        env.new_string("")?,
    )?;

    for (i, elem) in slice.iter().enumerate() {
        env.set_object_array_element(
            arr,
            i as i32,
            env.new_string(elem.to_string())?,
        )?;
    }

    Ok(JObject::from(arr))
}
