# macOS configuration guide

## Install dependencies
We recommend to install the next dependencies on macOS systems using [Homebrew](https://brew.sh/)

```bash
brew install yarn
brew install node
brew install watchman
brew tap AdoptOpenJDK/openjdk
brew cask install adoptopenjdk8
```

### React Native Cli
In a terminal run the following command.
```bash
npm install -g react-native-cli
```

From here, the process is a bit different if we want to build for iOS or Android.

## Android

### 1. Install Android Studio

- Download and install [Android Studio](https://developer.android.com/studio/index.html)

When prompted for the instalation type, select _Custom_ and make sure the next components will be installed:
- Android SDK
- Android SDK Platform
- Performance (Intel ® HAXM) (See here for AMD)
- Android Virtual Device

### 2. Install the Android SDK
The android sdk manager can be accessed via the Welcome window

- Click on `Configure` > `SDK Manager`

<img src="files/SDK_selection.png" width="75%"/>

- Select the package for the platform that you want to install, Locha Mesh Chat is intended to be used on affordable mobile devices, and can be installed in Android KitKat 4.4, it also can be installed in the latest Android versions. 
In the tab SDK manager select e.g. `Android 4.4 (KitKat)`-`API Level: 19` and click 'Apply'

<img src="files/API_selection.png" width="75%"/>

### 3. Configure the ANDROID_HOME environment variable
