import React, { Component } from "react";
import { Icon, Button } from "native-base";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import Sound from "react-native-sound";
import RNFS from "react-native-fs";

import { sha256 } from "js-sha256";
import { AudioRecorder, AudioUtils } from "react-native-audio";

/**
 *
 *
 * @export
 * @class ChatForm
 * @description component where is the form to write the message send notes from you and files
 * @extends {Component}
 */
export default class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      height: 20,
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath:
        AudioUtils.DocumentDirectoryPath + `/AUDIO_${new Date().getTime()}.aac`,
      hasPermission: undefined
    };
  }

  prepareRecordingPath = audioPath => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  };

  _play = async () => {
    if (this.state.recording) {
      await this._stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.

    var sound = new Sound(this.state.audioPath, "", error => {
      if (error) {
        console.log("failed to load the sound", error);
      } else {
        sound.play(success => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      }
    });
  };

  _record = async () => {
    if (this.state.recording) {
      console.warn("Already recording!");
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({ recording: true, paused: false });

    console.log("acaaa", this.state.audioPath);

    try {
      const filePath = await AudioRecorder.startRecording();

      console.log("holaaaaaa", filePath);
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount = () => {
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = data => {
        const newPath = `file:///${
          RNFS.ExternalStorageDirectoryPath
        }//Pictures/LochaMesh//AUDIO_${new Date().getTime()}.aac`;
        RNFS.exists(this.state.audioPath).then(data => {
          RNFS.moveFile(this.state.audioPath, newPath).then(() => {
            console.log("se guardo");
          });
        });
      };
    });
  };

  _stop = async () => {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({ stoppedRecording: true, recording: false, paused: false });

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === "android") {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  };

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({ finished: didSucceed });
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath} and size of ${fileSize || 0} bytes`
    );
  }

  send = () => {
    const { user, navigation, setChat, previousChat } = this.props;
    const toUID = navigation.params ? navigation.params.hashUID : null;
    const sendObject = {
      fromUID: sha256(user.uid),
      toUID: toUID,
      msg: {
        text: this.state.message
      },
      timestamp: new Date().getTime(),
      type: "msg"
    };

    const id = sha256(
      `${sha256(user.uid)} + ${toUID}  +  ${
        sendObject.msg.text
      }  + ${new Date().getTime()}`
    );

    setChat({ ...sendObject, msgID: id });
    this.setState({ message: "" });
  };

  render() {
    return (
      <View
        style={{ minHeight: 50, height: this.state.height, maxHeight: 120 }}
      >
        <ScrollView
          contentContainerStyle={styles.contentForm}
          keyboardShouldPersistTaps={"handled"}
        >
          <TouchableOpacity onPress={() => this._stop()}>
            <Icon
              style={styles.iconChatStyle}
              type="MaterialIcons"
              name="attach-file"
            />
          </TouchableOpacity>
          <TextInput
            multiline={true}
            style={{ height: this.state.height }}
            value={this.state.message}
            onChangeText={text => this.setState({ message: text })}
            onContentSizeChange={event => {
              this.setState({ height: event.nativeEvent.contentSize.height });
            }}
            placeholder="Mensaje"
            style={{
              flex: 1
            }}
          />

          {this.state.message.length === 0 && (
            <TouchableOpacity
              onPress={() => {
                this._record();
              }}
            >
              <Icon
                style={styles.iconChatStyle}
                type="MaterialIcons"
                name="mic"
              />
            </TouchableOpacity>
          )}

          {this.state.message.length === 0 && (
            <TouchableOpacity onPress={() => this._play()}>
              <Icon style={styles.iconChatStyle} name="play" />
            </TouchableOpacity>
          )}

          {this.state.message.length !== 0 && (
            <TouchableOpacity onPress={this.send}>
              <Icon
                style={styles.iconChatStyle}
                type="MaterialIcons"
                name="send"
              />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50
  },

  iconChatStyle: {
    color: "#fbc233",
    fontSize: 32,
    paddingHorizontal: 5,
    paddingBottom: 7
  },
  contentForm: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "space-between"
  }
});
