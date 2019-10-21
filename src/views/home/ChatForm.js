import React, { Component } from "react";
import { Icon, Button } from "native-base";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text
} from "react-native";
import Sound from "react-native-sound";
import RNFS from "react-native-fs";
import { FileDirectory } from "../../utils/utils";
import { sha256 } from "js-sha256";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import * as Animatable from "react-native-animatable";
import moment from "moment";

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

  handleViewRef = ref => (this.view = ref);

  componentDidMount = () => {
    const { user, navigation, setChat, previousChat } = this.props;
    const toUID = navigation.params ? navigation.params.hashUID : null;
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = data => {
        const newPath = `${FileDirectory}/Audios/AUDIO_${new Date().getTime()}.aac`;
        RNFS.exists(this.state.audioPath).then(() => {
          RNFS.moveFile(this.state.audioPath, newPath).then(() => {
            const sendObject = {
              fromUID: sha256(user.uid),
              toUID: toUID,
              msg: {
                text: "",
                typeFile: "audio"
              },
              timestamp: new Date().getTime(),
              type: "msg"
            };

            const id = sha256(
              `${sha256(user.uid)} + ${toUID}  +  ${
                sendObject.msg.text
              }  + ${new Date().getTime()}`
            );

            this.props.sendMessagesWithSound(
              { ...sendObject, msgID: id },
              newPath,
              data.base64
            );
          });
        });
      };
    });
  };

  prepareRecordingPath = audioPath => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
      IncludeBase64: true
    });
  };

  // _play = async () => {
  //   if (this.state.recording) {
  //     await this._stop();
  //   }

  //   // These timeouts are a hacky workaround for some issues with react-native-sound.
  //   // See https://github.com/zmxv/react-native-sound/issues/89.

  //   var sound = new Sound(this.state.audioPath, "", error => {
  //     if (error) {
  //       console.log("failed to load the sound", error);
  //     } else {
  //       sound.play(success => {
  //         if (success) {
  //           console.log("successfully finished playing");
  //         } else {
  //           console.log("playback failed due to audio decoding errors");
  //         }
  //       });
  //     }
  //   });
  // };

  _record = async () => {
    this.setState({ recording: true });
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
    } catch (error) {
      console.error(error);
    }
  };

  _stop = async () => {
    // this.setState({ recording: false });
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
          {!this.state.recording && (
            <>
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
                  this.setState({
                    height: event.nativeEvent.contentSize.height
                  });
                }}
                placeholder="Mensaje"
                style={{
                  flex: 1
                }}
              />
            </>
          )}
          <View style={{ flexDirection: "row" }}>
            {this.state.recording && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Animatable.View animation="slideInRight" duration={1000}>
                  <View
                    style={{
                      flexDirection: "row",
                      minWidth: "70%"
                    }}
                  >
                    <Icon
                      name="trash"
                      style={{ fontSize: 25, color: "#9e9e9e" }}
                    />
                    <Text style={{ fontSize: 20, marginLeft: 10 }}>
                      {moment
                        .utc(this.state.currentTime * 1000)
                        .format("mm:ss")}
                    </Text>
                    <View
                      style={{
                        marginHorizontal: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Icon
                        name="arrow-dropleft"
                        style={{ marginHorizontal: 10, color: "#9e9e9e" }}
                      />
                      <Text>Desliza para Cancelar</Text>
                    </View>
                  </View>
                </Animatable.View>
              </View>
            )}

            {this.state.message.length === 0 && (
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => this._record()}
                onPressOut={() => this._stop()}
              >
                <Icon
                  style={
                    this.state.recording
                      ? styles.buttonTouch
                      : styles.iconChatStyle
                  }
                  type="MaterialIcons"
                  name="mic"
                />
              </TouchableOpacity>
            )}
          </View>
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
  },
  buttonTouch: {
    color: "green",
    fontSize: 40,
    paddingHorizontal: 5,
    paddingBottom: 7
  }
});