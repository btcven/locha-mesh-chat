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

Screenshot_20200110_135149_com.lochameshchat.jpg


## Screens

<div align="center">

 <img height="400px" width="24%" src="documents/configuration/files/Screenshot_20200110_140312_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200110_140007_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200109_173557_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200110_135127_com.lochameshchat.jpg">
</div >

</br>
<div align="center">

 <img height="400px" width="24%" src="documents/configuration/files/Screenshot_20200109_173543_com.lochameshchat.jpg">
 <img height="400px" width="24%" src="documents/configuration/files/Screenshot_20200110_135149_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200110_135621_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200110_135127_com.lochameshchat.jpg">

</div >

<div align="center">

 <img height="400px" width="24%" src="documents/configuration/files/Screenshot_20200110_140324_com.lochameshchat.jpg">
 <img height="400px" width="24%" src="documents/configuration/files/Screenshot_20200110_140334_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200110_140347_com.lochameshchat.jpg">
 <img height="400Ppx" width="24%" src="documents/configuration/files/Screenshot_20200110_135047_com.lochameshchat.jpg">
</div >

 

## Technologies
*The following are brief descriptions of the technologies used*

### [React-Native](https://facebook.github.io/react-native/)
*React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React.*

What more can I say?  It's a fantastic leap forward in providing the ability to write native applications with Javascript that target both iOS and Android.

This application provides one code base that works on both platforms.  It demonstrates Form interactions,  Navigation, and use of many other components.

### [Redux](http://redux.js.org/)
*Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.*

Before Redux, application state was managed by all the various components in the app.  Now, the state is managed in a **predictable and consistent manner** and it can be **tested with Jest** and best of all, it is **independent** of the UI.  This is a major advancement in application design!

### [Realm](http://realm.io/)
Realm is a database engine designed to be used in the development of mobile applications for both Android and iOS systems. This system allows us to create relational databases in a simple way as well as being open source.

Realm Database is an alternative to SQLite and Core Data. Thanks to its zero-copy design, Realm Database is much faster than an ORM, and often faster than raw SQLite.

### [Native Base](http://nativebase.io/)
NativeBase is a sleek, ingenious and dynamic front-end framework created by passionate React Loving team at Geekyants to build cross platform Android & iOS mobile apps using ready to use generic components of React Native.


### [React Navigation](reactnavigation.org)
React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution written entirely in JavaScript (so you can read and understand all of the source), on top of powerful native primitives.


## Requirements
Before you start, make sure you have the following requirements

    - Node.js v10.x or greater
    - Java SE Development Kit (JDK 8)
    - Python 2.7
    - git
    
Check to have a dependency manager installed like [**npm**](https://) _(bundled with node)_ or [**yarn**](https://github.com/yarnpkg/yarn) _(recommended)_

## short Summary

1. The application runs on **both iOS and Android** with a **single code** base
1. A user can  **Create* or **restore** account, modify their profile, add contacts and use chat with public channels and added contacts 
1. The user can send text, audio and images in the chat
1. Random names on public channels
1. Supports multiple languages using I18n
1. **All state changes*** are actions to the Redux store.
1. **Every action** performed by the UI interfaces with the **Redux actions** and subsequently to the Redux Store.  This **reduces the complexity** of the JSX Components.


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

You can also open XCode and load project, Run product -> Run (⌘ + R)

```
Or, if you prefer Android:
```
 react-native run-android
```
for android verify that you have a device or emulator connected

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
