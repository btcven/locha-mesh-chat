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

#![allow(non_snake_case)]
#![recursion_limit = "1024"]

use jni::{objects::JClass, sys::jstring, JNIEnv};

pub mod runtime;
pub mod util;

pub use jni::errors::{
    Error as JniError, ErrorKind as JniErrorKind, Result as JniResult,
};
pub use jni::Executor;

#[no_mangle]
pub extern "system" fn Java_io_locha_p2p_util_LibraryLoader_nativeGetLibraryVersion(
    env: JNIEnv,
    _: JClass,
) -> jstring {
    env.new_string(lib_version()).unwrap().into_inner()
}

fn lib_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[test]
fn test_lib_version() {
    assert!(!lib_version().is_empty());
}
