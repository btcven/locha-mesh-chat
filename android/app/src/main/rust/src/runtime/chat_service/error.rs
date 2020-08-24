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

use std::{error, fmt, io};

use libp2p::TransportError;

/// Chat service error
#[derive(Debug)]
pub enum Error {
    /// I/O error
    Io(io::Error),
    /// libp2p transport error
    TransportError(TransportError<io::Error>),
    /// Chat service is already started
    AlreadyStarted,
    /// Chat service has not been started
    NotStarted,
    /// Chat service channel is closed
    ChannelClosed,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match *self {
            Error::AlreadyStarted => {
                write!(f, "chat service is already started")
            }
            Error::Io(ref e) => write!(f, "I/O error: {}", e),
            Error::TransportError(ref e) => write!(f, "transport error: {}", e),
            Error::NotStarted => write!(f, "chat service is not running"),
            Error::ChannelClosed => write!(f, "chat service channel is closed"),
        }
    }
}

impl error::Error for Error {}

impl From<io::Error> for Error {
    fn from(e: io::Error) -> Error {
        Error::Io(e)
    }
}

impl From<TransportError<io::Error>> for Error {
    fn from(e: TransportError<io::Error>) -> Error {
        Error::TransportError(e)
    }
}
