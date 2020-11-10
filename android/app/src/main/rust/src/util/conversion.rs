// Copyright 2018 The Exonum Team
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

use jni::objects::JString;
use jni::sys::{jbyteArray, jobjectArray};
use jni::JNIEnv;

use std::ptr;

use crate::JniResult;

/// Converts JNI `JString` into Rust `String`.
pub fn convert_to_string<'e, V>(env: &JNIEnv<'e>, val: V) -> JniResult<String>
where
    V: Into<JString<'e>>,
{
    Ok(env.get_string(val.into())?.into())
}

/// Converts array of Java bytes arrays (`byte[][]`) to the vector of Rust array representation.
pub fn java_arrays_to_rust<T, F>(
    env: &JNIEnv,
    array: jobjectArray,
    to_rust_array: F,
) -> JniResult<Vec<T>>
where
    F: Fn(&JNIEnv, jbyteArray) -> JniResult<T>,
{
    let num_elements = env.get_array_length(array)?;
    let mut result = Vec::with_capacity(num_elements as usize);
    for i in 0..num_elements {
        let array_element =
            env.auto_local(env.get_object_array_element(array, i)?);
        let array = to_rust_array(&env, array_element.as_obj().into_inner())?;
        result.push(array);
    }
    Ok(result)
}

/// Converts optional array of bytes into `jbyteArray`.
///
/// If `None` passed, returns null.
pub fn optional_array_to_java<B: AsRef<[u8]>>(
    env: &JNIEnv,
    slice: Option<B>,
) -> JniResult<jbyteArray> {
    slice.map_or(Ok(ptr::null_mut() as *mut _), |slice| {
        env.byte_array_from_slice(slice.as_ref())
    })
}
