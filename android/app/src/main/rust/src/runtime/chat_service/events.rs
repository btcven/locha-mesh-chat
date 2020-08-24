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

use libp2p::Multiaddr;

/// Chat service events
pub trait ChatServiceEvents: Send {
    /// New message received
    fn on_new_message(&mut self, message: String);

    /// New listening address
    ///
    /// This informs that the Chat Service is listening on the provided
    /// Multiaddress.
    fn on_new_listen_addr(&mut self, multiaddr: Multiaddr);
}
