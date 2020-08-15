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

//! # Handle resource manager
//!
//! This tracks information about created handles to properly debug
//! JNI bindings. This also verifies for validity of the stored handles
//! by doing type checking at runtime.
//!
//! Since the handles will go to Java back and forward we need to verify
//! that handles are valid.
//!
//! This can be disabled if for performance reasons if needed by disabling
//! the default features.
//!
//! The feature that enables this functionality is `runtime-typecheck`.

#[cfg(not(feature = "runtime-typecheck"))]
mod blank;
#[cfg(not(feature = "runtime-typecheck"))]
use blank::*;

#[cfg(feature = "runtime-typecheck")]
mod imp;
#[cfg(feature = "runtime-typecheck")]
pub use imp::*;
