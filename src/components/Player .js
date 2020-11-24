import React, { Component, PureComponent } from 'react';
import { View, Text, TouchableOpacity, NativeModules } from 'react-native';
import { Icon } from 'native-base';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import moment from 'moment';
import PlayerModule from '../utils/AudioPlayer';

class Player extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      duration: 0,
      reproduced: 0
    };
    this.player = NativeModules.PlayerModule;
    // eslint-disable-next-line no-undef
    sound = undefined;
    this.prepare(props.path);
  }

  prepare = async () => {
    const result = await this.player.prepare(this.props.path);
    if (result) {
      this.setState({
        duration: result.duration
      });
    }
  }
  componentDidMount = async () => {
    this.sound = new Sound(this.props.path, '', () => {
    });
  };

  componentDidUpdate = async (prevProps) => {
    if (this.props.path !== prevProps.path) {
      const result = await this.player.prepare(this.props.path);
      if (result) {
        this.setState({
          duration: result.duration
        });
      }
    }
    if (this.state.play) {
      this.sound.getCurrentTime((seconds) => {
        this.setState({ reproduced: seconds });
      });
    }
  };

  play = async () => {
    this.setState({ play: true });
    this.sound.play((success) => {
      if (success) {
        this.setState({ play: false });
        setTimeout(() => {
          this.setState({ reproduced: 0 });
        }, 1);
      } else {
        // eslint-disable-next-line no-console
        console.log('playback failed due to audio decoding errors');
      }
    });
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }

    this.setState({ play: false });
  };

  onSliderEditing = (value) => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ reproduced: value });
    }
  };

  render() {
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
      >
        {!this.state.play && (
          <TouchableOpacity testID="playButton" onPress={() => this.play()}>
            <Icon name="play" style={{ color: '#616161', fontSize: 22 }} />
          </TouchableOpacity>
        )}
        {this.state.play && (
          <TouchableOpacity testID="pauseButton" onPress={() => this.pause()}>
            <Icon name="pause" style={{ color: '#616161', fontSize: 22 }} />
          </TouchableOpacity>
        )}

        <Slider
          style={{ width: 150 }}
          minimumValue={0}
          value={this.state.reproduced}
          onValueChange={this.onSliderEditing}
          maximumValue={this.state.duration}
          minimumTrackTintColor="#FAB300"
          thumbTintColor="#FAB300"
        />

        {(this.state.play || this.state.reproduced > 0) && (
          <Text style={{ position: 'absolute', top: 29 }}>
            {moment
              .utc((this.state.duration - this.state.reproduced) * 1000)
              .format('m:ss')}
          </Text>
        )}

        {!this.state.play && this.state.reproduced < 1 && (
          <Text style={{ position: 'absolute', top: 29 }}>
            {moment.utc(this.state.duration * 1000).format('m:ss')}
          </Text>
        )}
      </View>
    );
  }
}


export default Player;
