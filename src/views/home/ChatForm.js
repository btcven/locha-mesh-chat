/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Icon } from 'native-base';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
  Animated,
} from 'react-native';
import RNFS from 'react-native-fs';
import { sha256 } from 'js-sha256';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import { FileDirectory } from '../../utils/utils';
import Draggable from '../../components/Draggable';
import { messageType } from '../../utils/constans';

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
      message: '',
      height: 20,
      currentTime: 0.0,
      recording: false,
      moveText: new Animated.ValueXY(),
      cancelRecoding: false,
      audioPath:
        `${AudioUtils.DocumentDirectoryPath}/AUDIO_${new Date().getTime()}.aac`,
      hasPermission: undefined
    };
  }

  componentDidMount = async () => {
    this._val = { x: 0, y: 0 };
    const recoderPermision = await AudioRecorder.checkAuthorizationStatus();
    this.setState({ hasPermission: recoderPermision });
  };

  prepareRecordingPath = (audioPath) => {
    try {
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'aac',
        AudioEncodingBitRate: 32000,
        IncludeBase64: true,
        OutputFormat: Platform === 'android' ? undefined : 'aac_adts',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('error', err);
    }
  };

  _record = async () => {
    const { user, navigation } = this.props;
    const toUID = navigation.params ? navigation.params.uid : null;

    if (this.state.hasPermission) {
      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      try {
        this.setState({
          recording: true,
          cancelRecoding: false
        });

        await AudioRecorder.startRecording();
      } catch (error) {
        this.setState({ recording: false });
      }
      AudioRecorder.onFinished = (data) => {
        if (this.state.currentTime !== 0 && !this.state.cancelRecoding) {
          const newPath = `${FileDirectory}/Audios/AUDIO_${new Date().getTime()}.aac`;
          RNFS.exists(this.state.audioPath).then(() => {
            RNFS.moveFile(this.state.audioPath, newPath).then(() => {
              const sendObject = {
                fromUID: user.ipv6Address,
                toUID,
                msg: {
                  text: '',
                  typeFile: 'audio'
                },
                timestamp: new Date().getTime(),
                type: messageType.MESSAGE
              };

              const id = sha256(
                `${user.ipv6Address} + ${toUID}  +  
                ${
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
        }
      };
    } else {
      AudioRecorder.requestAuthorization().then(async (isAuthorised) => {
        this.setState({ recording: false, hasPermission: isAuthorised });
      });
    }
  };

  _stop = async () => {
    if (!this.state.recording) {
      return;
    }
    this.setState({
      recording: false,
    });
    try {
      const filePath = await AudioRecorder.stopRecording();
      if (Platform.OS === 'android') {
        this._finishRecording(true);
      }
      // eslint-disable-next-line consistent-return
      return filePath;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  // eslint-disable-next-line react/sort-comp
  _finishRecording(didSucceed) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ finished: didSucceed });
  }

  send = () => {
    const { user, navigation, setChat } = this.props;
    const toUID = navigation.params.uid;
    const sendObject = {
      fromUID: user.ipv6Address,
      toUID,
      msg: {
        text: this.state.message
      },
      timestamp: new Date().getTime(),
      type: messageType.MESSAGE
    };

    const id = sha256(
      `${user.ipv6Address} + ${toUID}  +  ${
        sendObject.msg.text
      }  + ${new Date().getTime()}`
    );

    setChat({ ...sendObject, msgID: id }, 'pending');
    this.setState({ message: '' });
  };

  moveText = (value) => {
    if (value.__getValue().x < -30 && !this.state.cancelRecoding) {
      this.setState({ cancelRecoding: true });
    }
    this.state.moveText.setValue(value.__getValue());
  };

  render() {
    const { screenProps } = this.props;
    return (
      <View
        style={{ minHeight: 50, height: this.state.height, maxHeight: 120 }}
      >
        <ScrollView
          contentContainerStyle={styles.contentForm}
          keyboardShouldPersistTaps="handled"
        >
          {!this.state.recording && (
            <>
              <TouchableOpacity onPress={() => this.props.openFileModal()}>
                <Icon
                  style={styles.iconChatStyle}
                  type="MaterialIcons"
                  name="attach-file"
                />
              </TouchableOpacity>
              <TextInput
                multiline
                style={[{ height: this.state.height }, styles.inputStyle]}
                value={this.state.message}
                onChangeText={(text) => this.setState({ message: text })}
                onContentSizeChange={(event) => {
                  this.setState({
                    height: event.nativeEvent.contentSize.height
                  });
                }}
                placeholder={screenProps.t('Chats:message')}
              />
            </>
          )}
          <View style={{ flexDirection: 'row' }}>
            {this.state.recording && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Animatable.View animation="slideInRight" duration={1000}>
                  <View
                    style={{
                      flexDirection: 'row',
                      minWidth: '70%'
                    }}
                  >
                    <Icon
                      name="trash"
                      style={{ fontSize: 25, color: '#9e9e9e' }}
                    />
                    <Text style={{ fontSize: 20, marginLeft: 10 }}>
                      {moment
                        .utc(this.state.currentTime * 1000)
                        .format('mm:ss')}
                    </Text>
                    <Animated.View
                      style={[
                        this.state.moveText.getLayout(),
                        {
                          marginHorizontal: 10,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }
                      ]}
                    >
                      <Icon
                        name="arrow-dropleft"
                        style={{ marginHorizontal: 10, color: '#9e9e9e' }}
                      />
                      <Text>{screenProps.t('Chats:cancelAudio')}</Text>
                    </Animated.View>
                  </View>
                </Animatable.View>
              </View>
            )}

            {this.state.message.length === 0 && (
              <Draggable
                moveText={this.moveText}
                onPressIn={() => this._record()}
                onPressOut={() => this._stop()}
              >
                <TouchableOpacity activeOpacity={1}>
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
              </Draggable>
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
    color: '#fbc233',
    fontSize: 32,
    paddingHorizontal: 5,
    paddingBottom: 7
  },
  contentForm: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-between'
  },
  buttonTouch: {
    color: 'green',
    fontSize: 40,
    paddingHorizontal: 5,
    paddingBottom: 7
  },
  inputStyle: {
    flex: 1,
    ...Platform.select({
      ios: { marginVertical: 15 }
    })
  }

});
