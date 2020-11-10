// Copyright 2018 The Exonum Team
// Copyright 2020 Bitcoin Venezuela and Locha Mesh Developers
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

//! Caching some of the often used methods and classes helps to improve
//! performance. Caching is done immediately after loading of the native
//! library by JVM. To do so, we use JNI_OnLoad method. JNI_OnUnload is not
//! currently used because we don't need to reload native library multiple times
//! during execution.
//!
//! See: https://docs.oracle.com/en/java/javase/12/docs/specs/jni/invocation.html#jni_onload

use std::{os::raw::c_void, panic::catch_unwind};

use jni::{
    objects::{GlobalRef, JMethodID},
    sys::{jint, JNI_VERSION_1_6},
    JNIEnv, JavaVM,
};
use log::debug;
use parking_lot::Once;

/// Invalid JNI version constant, signifying JNI_OnLoad failure.
const INVALID_JNI_VERSION: jint = 0;
const CHAT_SERVICE_EVENTS_INTERFACE: &str =
    "io/locha/p2p/runtime/RuntimeEvents";

static INIT: Once = Once::new();

static mut OBJECT_GET_CLASS: Option<JMethodID> = None;
static mut CLASS_GET_NAME: Option<JMethodID> = None;
static mut THROWABLE_GET_MESSAGE: Option<JMethodID> = None;
static mut THROWABLE_GET_CAUSE: Option<JMethodID> = None;

static mut JAVA_LANG_ERROR: Option<GlobalRef> = None;
static mut JAVA_LANG_RUNTIME_EXCEPTION: Option<GlobalRef> = None;
static mut JAVA_LANG_ILLEGAL_ARGUMENT_EXCEPTION: Option<GlobalRef> = None;
static mut JAVA_LANG_STRING: Option<GlobalRef> = None;

static mut CHAT_SERVICE_EVENTS_ON_NEW_MESSAGE: Option<JMethodID> = None;
#[rustfmt::skip]
static mut CHAT_SERVICE_EVENTS_ON_CONNECTION_ESTABLISHED: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_CONNECTION_CLOSED: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_INCOMING_CONNECTION: Option<JMethodID> = None;
#[rustfmt::skip]
static mut CHAT_SERVICE_EVENTS_ON_INCOMING_CONNECTION_ERROR: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_BANNED_PEER: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_UNREACHABLE_ADDR: Option<JMethodID> = None;
#[rustfmt::skip]
static mut CHAT_SERVICE_EVENTS_ON_UNKNOWN_PEER_UNREACHABLE_ADDR: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_NEW_LISTEN_ADDR: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_EXPIRED_LISTEN_ADDR: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_LISTENER_CLOSED: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_LISTENER_ERROR: Option<JMethodID> = None;
static mut CHAT_SERVICE_EVENTS_ON_DIALING: Option<JMethodID> = None;

/// This function is executed on loading native library by JVM.
/// It initializes the cache of method and class references.
#[allow(non_snake_case)]
#[no_mangle]
pub extern "system" fn JNI_OnLoad(
    vm: *mut jni::sys::JavaVM,
    _: *mut c_void,
) -> jint {
    let vm = unsafe { JavaVM::from_raw(vm).unwrap() };

    android_logger::init_once(
        android_logger::Config::default()
            .with_min_level(log::Level::Trace)
            .with_tag("LochaP2P"),
    );

    let env = vm.get_env().expect("Cannot get reference to the JNIEnv");

    catch_unwind(|| {
        init_cache(&env);
        JNI_VERSION_1_6
    })
    .unwrap_or(INVALID_JNI_VERSION)
}

/// Initializes JNI cache considering synchronization
pub fn init_cache(env: &JNIEnv) {
    INIT.call_once(|| unsafe { cache_methods(env) });
}

/// Caches all required classes and methods ids.
#[rustfmt::skip]
unsafe fn cache_methods(env: &JNIEnv) {
    OBJECT_GET_CLASS = get_method_id(&env, "java/lang/Object", "getClass", "()Ljava/lang/Class;");
    CLASS_GET_NAME = get_method_id(&env, "java/lang/Class", "getName", "()Ljava/lang/String;");
    THROWABLE_GET_MESSAGE = get_method_id(&env, "java/lang/Throwable", "getMessage", "()Ljava/lang/String;");
    THROWABLE_GET_CAUSE = get_method_id(&env, "java/lang/Throwable", "getCause", "()Ljava/lang/Throwable;");
    JAVA_LANG_ERROR = get_class(env, "java/lang/Error");
    JAVA_LANG_RUNTIME_EXCEPTION = get_class(env, "java/lang/RuntimeException");
    JAVA_LANG_ILLEGAL_ARGUMENT_EXCEPTION = get_class(env, "java/lang/IllegalArgumentException");
    JAVA_LANG_STRING = get_class(env, "java/lang/String");

    CHAT_SERVICE_EVENTS_ON_NEW_MESSAGE = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onNewMessage", "(Ljava/lang/String;Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_CONNECTION_ESTABLISHED = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onConnectionEstablished", "(Ljava/lang/String;I)V");
    CHAT_SERVICE_EVENTS_ON_CONNECTION_CLOSED = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onConnectionClosed", "(Ljava/lang/String;ILjava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_INCOMING_CONNECTION = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onIncomingConnection", "(Ljava/lang/String;Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_INCOMING_CONNECTION_ERROR = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onIncomingConnectionError", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_BANNED_PEER = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onBannedPeer", "(Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_UNREACHABLE_ADDR = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onUnreachableAddr", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V");
    CHAT_SERVICE_EVENTS_ON_UNKNOWN_PEER_UNREACHABLE_ADDR = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onUnknownPeerUnreachableAddr", "(Ljava/lang/String;Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_NEW_LISTEN_ADDR = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onNewListenAddr", "(Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_EXPIRED_LISTEN_ADDR = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onExpiredListenAddr", "(Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_LISTENER_CLOSED = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onListenerClosed", "([Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_LISTENER_ERROR = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onListenerError", "(Ljava/lang/String;)V");
    CHAT_SERVICE_EVENTS_ON_DIALING = get_method_id(&env, CHAT_SERVICE_EVENTS_INTERFACE, "onDialing", "(Ljava/lang/String;)V");

    debug!("Done caching references to Java classes and methods.");
}

/// Produces `JMethodID` for a particular method dealing with its lifetime.
///
/// Always returns `Some(method_id)`, panics if method not found.
fn get_method_id(
    env: &JNIEnv,
    class: &str,
    name: &str,
    sig: &str,
) -> Option<JMethodID<'static>> {
    let method_id = env
        .get_method_id(class, name, sig)
        // we need this line to erase lifetime in order to save underlying raw pointer in static
        .map(|mid| mid.into_inner().into())
        .unwrap_or_else(|_| {
            panic!(
                "Method {} with signature {} of class {} not found",
                name, sig, class
            )
        });
    Some(method_id)
}

/// Returns cached class reference.
///
/// Always returns Some(class_ref), panics if class not found.
fn get_class(env: &JNIEnv, class: &str) -> Option<GlobalRef> {
    let class = env
        .find_class(class)
        .unwrap_or_else(|_| panic!("Class {} not found", class));
    Some(env.new_global_ref(class).unwrap())
}

fn check_cache_initialized() {
    if !INIT.state().done() {
        panic!("JNI cache is not initialized")
    }
}

/// Refers to the cached methods of the `ChatServiceEvents` interface.
pub mod chat_service_events {
    use super::*;

    /// Returns cached `JMethodID` for `ChatServiceEvents.onNewMessage`.
    pub fn on_new_message_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_NEW_MESSAGE.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onConnectionEstablished`.
    pub fn on_connection_established_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_CONNECTION_ESTABLISHED.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onConnectionClosed`.
    pub fn on_connection_closed_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_CONNECTION_CLOSED.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onIncomingConnection`.
    pub fn on_incoming_connection_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_INCOMING_CONNECTION.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onIncomingConnectionError`.
    pub fn on_incoming_connection_error_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_INCOMING_CONNECTION_ERROR.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onBannedPeer`.
    pub fn on_banned_peer_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_BANNED_PEER.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onUnreachableAddr`.
    pub fn on_unreachable_addr_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_UNREACHABLE_ADDR.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onUnknownPeerUnreachable`.
    pub fn on_unknown_peer_unreachable_addr_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_UNKNOWN_PEER_UNREACHABLE_ADDR.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onNewListenAddr`.
    pub fn on_new_listen_addr_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_NEW_LISTEN_ADDR.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onExpiredListenAddr`.
    pub fn on_expired_listen_addr_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_EXPIRED_LISTEN_ADDR.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onListenerClosed`.
    pub fn on_listener_closed_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_LISTENER_CLOSED.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onListenerError`.
    pub fn on_listener_error_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_LISTENER_ERROR.unwrap() }
    }

    /// Returns cached `JMethodID` for `ChatServiceEvents.onDialing`.
    pub fn on_dialing_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CHAT_SERVICE_EVENTS_ON_DIALING.unwrap() }
    }
}

/// Refers to the cached methods of the `java.lang.Object` class.
pub mod object {
    use super::*;

    /// Returns cached `JMethodID` for `java.lang.Object.getClass()`.
    pub fn get_class_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { OBJECT_GET_CLASS.unwrap() }
    }
}

/// Refers to the cached methods of the `java.lang.Class` class.
pub mod class {
    use super::*;

    /// Returns cached `JMethodID` for `java.lang.Class.getName()`.
    pub fn get_name_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { CLASS_GET_NAME.unwrap() }
    }
}

/// Refers to the cached methods of the `java.lang.Throwable` class.
pub mod throwable {
    use super::*;

    /// Returns cached `JMethodID` for `java.lang.Throwable.getMessage()`.
    pub fn get_message_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { THROWABLE_GET_MESSAGE.unwrap() }
    }

    /// Returns cached `JMethodID` for `java.lang.Throwable.getCause()`.
    pub fn get_cause_id() -> JMethodID<'static> {
        check_cache_initialized();
        unsafe { THROWABLE_GET_CAUSE.unwrap() }
    }
}

/// Provides access to various cached classes.
pub mod classes_refs {
    use super::*;

    /// Returns cached `JClass` for `java/lang/Error` as a `GlobalRef`.
    pub fn java_lang_error() -> GlobalRef {
        check_cache_initialized();
        unsafe { JAVA_LANG_ERROR.clone().unwrap() }
    }

    /// Returns cached `JClass` for `java/lang/RuntimeException` as a `GlobalRef`.
    pub fn java_lang_runtime_exception() -> GlobalRef {
        check_cache_initialized();
        unsafe { JAVA_LANG_RUNTIME_EXCEPTION.clone().unwrap() }
    }

    /// Returns cached `JClass` for `java/lang/IllegalArgumentException` as a `GlobalRef`.
    pub fn java_lang_illegal_argument_exception() -> GlobalRef {
        check_cache_initialized();
        unsafe { JAVA_LANG_ILLEGAL_ARGUMENT_EXCEPTION.clone().unwrap() }
    }

    /// Returns cached `JClass` for `java/lang/String` as a `GlobalRef`.
    pub fn java_lang_string() -> GlobalRef {
        check_cache_initialized();
        unsafe { JAVA_LANG_STRING.clone().unwrap() }
    }
}
