import React, { PureComponent } from 'react';
import {
  View, Text, TouchableOpacity, NativeModules
} from 'react-native';
import { Icon } from 'native-base';
import Slider from '@react-native-community/slider';
import moment from 'moment';

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

  componentDidMount = () => {
    const result = await this.player.prepare(this.props.path);
    console.log({})
    if (result) {
      this.setState({
        duration: result.duration,
        keyPlayer: result.key
      });
    }
  }

  componentDidUpdate = async (prevProps) => {
    if (this.props.path !== prevProps.path) {
      const result = await this.player.prepare(this.props.path);
      if (result) {
        this.setState({
          duration: result.duration,
          keyPlayer: result.key
        });
      }
    }

    if (this.state.play && !this.interval) {
      this.getDuration();
    }
  };


  componentWillUnmount = () => {
    // Audio destructor
    this.setState({
      duration: 0,
      keyPlayer: null
    });
    this.player.release(this.state.keyPlayer);
  }


  getDuration = () => {
    this.interval = setInterval(() => {
      this.player.getCurrentTime(this.state.keyPlayer, ({ seconds, isPlaying }) => {
        if (isPlaying) {
          this.setState({ reproduced: seconds });
        } else if (!isPlaying) {
          clearInterval(this.interval);
          this.interval = null;
        }
      });
    }, 100);
  }

  play = async () => {
    this.setState({ play: true });
    this.player.play(this.state.keyPlayer).then((success) => {
      if (success) {
        this.setState({ play: false, reproduced: 0 });
      } else {
        // eslint-disable-next-line no-console
        console.log('playback failed due to audio decoding errors');
      }
    });
  };

  pause = () => {
    this.player.pause(this.state.keyPlayer, (success) => {
      if (success) {
        this.setState({ play: false });
      }
    });
  };

  onSliderEditing = (value) => {
    this.player.setCurrentTime(this.state.keyPlayer, value);
    this.setState({ reproduced: value });
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
