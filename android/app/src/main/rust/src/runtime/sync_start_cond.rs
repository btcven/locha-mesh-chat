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

use std::error::Error;
use std::sync::Arc;

use parking_lot::{Condvar, Mutex};

use log::trace;

/// Error type that can be sent between threads
pub type StartError = Box<dyn Error + Send + 'static>;

/// Status of the thread start
enum StartStatus {
    /// Thread has not been started
    NotStarted,
    /// Thread started successfully
    Started,
    /// Thread initialization faileds
    Failed(StartError),
}

impl StartStatus {
    /// Unwrap `StartStatus::Failed(_)` variant.
    ///
    /// # Panics
    ///
    /// This function panics if the value is not `StartStatus::Failed`.
    fn unwrap_failed(self) -> StartError {
        match self {
            StartStatus::NotStarted | StartStatus::Started => panic!(
                "called `unwrap_failed` on non `StartStatus::Failed()` value"
            ),
            StartStatus::Failed(e) => e,
        }
    }
}

/// Syncrhonized start condition
///
/// This is used to synchronize the start between a thread and another,
/// or in other words to signal when initialization has been done and
/// the thread is running autonomously and ready to receive events from
/// the network or take actions.
///
/// The type is reference counted and thus, any clone will reference the
/// same SyncStartCond.
///
/// # Examples
///
/// ```rust
/// use std::thread;
/// use locha_p2p::runtime::sync_start_cond::SyncStartCond;
///
/// let cond = SyncStartCond::new();
/// let cond2 = cond.clone();
///
/// println!("Starting thread");
///
/// thread::spawn(move || {
///     let cond = cond2;
///     cond.notify_start();
///     // or cond.notify_failure(error); if failed;
///
///     loop {
///         // Event loop ...
///     }
/// });
///
/// println!("Waiting for thread to finish initialization");
///
/// cond.wait().expect("Thread failed initialization");
///
/// println!("Thread started successfully");
/// ```
#[derive(Clone)]
pub struct SyncStartCond {
    inner: Arc<(Mutex<StartStatus>, Condvar)>,
}

impl SyncStartCond {
    /// Create new `SyncStartCond`
    ///
    /// # Example
    ///
    /// ```rust
    /// use locha_p2p::runtime::sync_start_cond::SyncStartCond;
    ///
    /// let cond = SyncStartCond::new();
    /// ```
    pub fn new() -> SyncStartCond {
        SyncStartCond {
            inner: Arc::new((
                Mutex::new(StartStatus::NotStarted),
                Condvar::new(),
            )),
        }
    }

    /// Notify successful start.
    pub fn notify_start(&self) {
        trace!("notifying start");

        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        *started = StartStatus::Started;
        cvar.notify_one();
    }

    /// Notify start failure.
    pub fn notify_failure<E>(&self, e: E)
    where
        E: Error + Send + 'static,
    {
        trace!("notifying failure");

        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        *started = StartStatus::Failed(Box::new(e));
        cvar.notify_one();
    }

    /// Wait for start.
    ///
    /// # Notes
    ///
    /// The thread can notify a failure or a successful using
    /// [`notify_failure`](fn.notify_failure.html) or with
    /// [`notify_start`](fn.notify_start.html) respectively.
    pub fn wait(self) -> Result<(), StartError> {
        use std::mem::replace;

        trace!("waiting for thread to start");

        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        match &*started {
            // Thread has not started, let's wait for a notification.
            StartStatus::NotStarted => {
                trace!("thread has not been started yet");

                cvar.wait(&mut started);
                match &*started {
                    // NotStarted SHOULD not be signaled.
                    StartStatus::NotStarted => unreachable!(),
                    StartStatus::Started => Ok(()),
                    StartStatus::Failed(_) => {
                        Err(replace(&mut *started, StartStatus::NotStarted)
                            .unwrap_failed())
                    }
                }
            }
            // Thread started, return the appropiate values. We replace the
            // value in the StartStatus::Failed variant as we can't take
            // ownership of the value contained there, as it's shared between
            // threads.
            StartStatus::Started => Ok(()),
            StartStatus::Failed(_) => {
                Err(replace(&mut *started, StartStatus::NotStarted)
                    .unwrap_failed())
            }
        }
    }
}

#[cfg(test)]
pub mod tests {
    use super::*;

    #[test]
    fn start_status_ok() {
        use std::thread;

        let cond = SyncStartCond::new();
        thread::spawn({
            let cond = cond.clone();

            move || {
                cond.notify_start();
            }
        });

        cond.wait().expect("Thread failed initialization");
    }

    #[test]
    #[should_panic]
    fn start_status_err() {
        use std::error::Error;
        use std::fmt;
        use std::thread;

        #[derive(Debug)]
        struct DummyError;

        impl fmt::Display for DummyError {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> std::fmt::Result {
                write!(f, "DummyError")
            }
        }

        impl Error for DummyError {}

        let cond = SyncStartCond::new();
        thread::spawn({
            let cond = cond.clone();

            move || {
                cond.notify_failure(DummyError);
            }
        });

        cond.wait().unwrap();
    }
}
