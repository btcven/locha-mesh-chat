<p align="center">
  <a href="https://locha.io/">
    <img height="200px" src="documents/configuration/files/logo.png">
  </a>
  <br>
</p>
<p align="center">
  <a href="https://locha.io/">Project Website</a> |
  <a href="https://locha.io/donate">Donate</a> |
  <a href="https://github.com/sponsors/rdymac">Sponsor</a> |
  <a href="https://locha.io/buy">Buy</a>
</p>
<h1 align="center">Locha Mesh Chat</h1>
 

The first mobile application for the Locha Mesh. The aim is to build an app for communication using text messages, images, documents or voice notes, and also for broadcasting offline signed Bitcoin transactions.


## What's Locha Mesh

The Locha Mesh network is a secure radio network for text messaging and bitcoin
transactions. The main objetive is a long range network for everyone and
everywhere, for this reason, we are working not only in a protocol, also the
firmware for affordable devices like our "Turpial".

If you want to learn more about Locha Mesh feel free to read
[this repository](https://github.com/btcven/locha) or take a look at our website
[locha.io](https://www.locha.io).

## Sponsor.

If you want to support this project you can make a donation to the Locha Mesh
effort to build a private censorship-resistant mesh network devices for Bitcoin and Lightning Network payments without Internet.

Here are some places if you want to support us:

- Donate: https://locha.io/donate
- Buy Turpial devices: https://locha.io/buy


## Development workflow

The development code is located on the `dev` branch, all the development
happens there and all of the Pull-Request should be pointed to that branch.
Make sure your Pull-Request follows the [CONTRIBUTING.md](CONTRIBUTING.md)
 guidelines.


## Requirements
Before you start, make sure you have the following requirements

    - Node.js v10.x or greater
    - Java SE Development Kit (JDK 8)
    - Python 2.7
    - git
    
Check to have a dependency manager installed like [**npm**](https://) _(bundled with node)_ or [**yarn**](https://github.com/yarnpkg/yarn) _(recommended)_

## 2. Clone and Install

### Clone this repository 
```bash
git clone https://github.com/btcven/locha-mesh-chat.git
```

### Go into directory
```bash
cd locha-mesh-chat
```

### Install dependencies

With yarn

```bash
yarn install
```
or npm
```bash
npm install
```

### Equipment configuration

You need to configure your equipment to run this app, the process is different depending on your development system:
  
  * [macOS](documents/configuration/macOS.md)
  * Windows :construction_worker:
  * [Linux](documents/configuration/Linux.md)

In this link are the steps to follow the official [Documentation](https://facebook.github.io/react-native/docs/0.59/getting-started)

### Add native dependencies to the project

```
 react-native link

```

#### 2. Open RNS in your iOS simulator

Run this command to start the development server and to start your app on iOS simulator:

```
react-native run-ios

```
Or, if you prefer Android:
```
 react-native run-android
```

## License

Copyright (c) 2019 Bitcoin Venezuela and Locha Mesh developers.

Licensed under the **Apache License, Version 2.0**

---
**A text quote is shown below**

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
___
Read the full text:
[Locha Mesh Apache License 2.0](https://github.com/btcven/LochaMesh-Chat/blob/master/LICENSE)
