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
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import Draggable from '../../components/Draggable';
import { messageType } from '../../utils/constans';
import { bitcoin, audioRecorder } from '../../../App';

/**
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
      hasPermission: undefined
    };
  }

  onProgress = () => {
    audioRecorder.onProgres((data) => {
      this.setState({ currentTime: Math.floor(data) });
      if (Math.floor(data) >= 30) {
        this.stop();
      }
    });
  }

  onFinished = () => {
    audioRecorder.onFinished((data) => {
      this.sendAudio(data);
    });
  };

  sendAudio = (data) => {
    const { user, navigation } = this.props;
    const toUID = navigation.params.chatUID;
    if (this.state.currentTime !== 0 && !this.state.cancelRecoding) {
      RNFS.exists(data.path).then(async () => {
        const sendObject = {
          fromUID: user.peerID,
          toUID,
          msg: {
            text: '',
            typeFile: 'audio'
          },
          timestamp: new Date().getTime(),
          type: messageType.MESSAGE
        };


        const id = await bitcoin.sha256(
          `${user.peerID} + ${toUID}  +  
            ${sendObject.msg.text
          }  + ${new Date().getTime()}`
        );

        this.props.sendMessagesWithSound(
          user.peerID,
          { ...sendObject, msgID: id },
          data.path,
          data.file
        );
      });
    }
  }

  componentDidMount = async () => {
    this._val = { x: 0, y: 0 };
    const recoderPermision = await audioRecorder.checkRecorderPermisionStatus();
    this.setState({ hasPermission: recoderPermision });
    this.onProgress();
    this.onFinished();
  };

  record = async () => {
    if (this.state.hasPermission) {
      audioRecorder.prepareRecoder();
      this.setState({
        recording: true,
        cancelRecoding: false
      });
      await audioRecorder.startRecording();
    } else {
      audioRecorder.requestRecoderPermision().then(async (isAuthorised) => {
        this.setState({ recording: false, hasPermission: isAuthorised });
      });
    }
  };

  stop = async () => {
    if (!this.state.recording) {
      return;
    }
    this.setState({
      recording: false,
    });
    await audioRecorder.stopRecording();
  };

  send = async () => {
    const { user, navigation, setChat } = this.props;
    const toUID = navigation.params.chatUID;

    const sendObject = {
      fromUID: user.peerID,
      toUID,
      msg: {
        text: this.state.message
      },
      timestamp: new Date().getTime(),
      type: messageType.MESSAGE
    };

    const id = await bitcoin.sha256(
      `${user.peerID} + ${toUID}  +  ${sendObject.msg.text
      }  + ${new Date().getTime()}`
    );

    setChat(user.peerID, { ...sendObject, msgID: id }, 'pending');
    this.setState({ message: '' });
  };

  moveText = (value) => {
    if (value.__getValue().x < -30 && !this.state.cancelRecoding) {
      this.setState({ cancelRecoding: true });
    }
    this.state.moveText.setValue(value.__getValue());
  };


  componentWillUnmount = () => {
    audioRecorder.removeListener();
    this.setState = () => {
      return;
    };
  }

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
                        name="arrow-back"
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
                onPressIn={() => this.record()}
                onPressOut={() => this.stop()}
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
