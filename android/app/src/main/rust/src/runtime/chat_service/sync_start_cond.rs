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

use std::sync::Arc;

use parking_lot::{Condvar, Mutex};

use log::trace;

/// Status of the thread start
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum StartStatus {
    /// Thread started successfully
    Started,
    /// Thread initialization failed
    Failed,
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
///     // or cond.notify_failure(); if failed;
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
    inner: Arc<(Mutex<Option<StartStatus>>, Condvar)>,
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
            inner: Arc::new((Mutex::new(None), Condvar::new())),
        }
    }

    /// Notify successful start.
    pub fn notify_start(&self) {
        trace!("notifying start");

        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        *started = Some(StartStatus::Started);
        cvar.notify_one();
    }

    /// Notify start failure.
    pub fn notify_failure(&self) {
        trace!("notifying failure");

        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        *started = Some(StartStatus::Failed);
        cvar.notify_one();
    }

    /// Wait for start.
    ///
    /// # Notes
    ///
    /// The thread can notify a failure or a successful using
    /// [`notify_failure`](fn.notify_failure.html) or with
    /// [`notify_start`](fn.notify_start.html) respectively.
    pub fn wait(self) -> StartStatus {
        use std::mem::replace;

        trace!("waiting for thread to start");

        let &(ref lock, ref cvar) = &*self.inner;
        let mut started = lock.lock();
        match &*started {
            // Thread has not started, let's wait for a notification.
            None => {
                trace!("thread has not been started yet");

                cvar.wait(&mut started);
                match &*started {
                    None => unreachable!(),
                    Some(_) => replace(&mut *started, None).unwrap(),
                }
            }
            Some(_) => replace(&mut *started, None).unwrap(),
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

        assert_eq!(cond.wait(), StartStatus::Started);
    }

    #[test]
    fn start_status_err() {
        use std::thread;

        let cond = SyncStartCond::new();
        thread::spawn({
            let cond = cond.clone();

            move || {
                cond.notify_failure();
            }
        });

        assert_eq!(cond.wait(), StartStatus::Failed);
    }
}
