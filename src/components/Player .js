import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, NativeModules
} from 'react-native';
import { Icon } from 'native-base';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import { connect } from 'react-redux';
import { playAction, closedPlayer } from '../store/chats/chatAction';

class Player extends Component {
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
  }

  componentDidMount = async () => {
    const result = await this.player.prepare(this.props.path);
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

    if (!this.props.forcedPause) {
      if (this.state.play && this.state.pause) {
        this.setState({
          pause: undefined
        });
      }
      const rule1 = prevProps.keyPlay === this.props.keyPlay;
      if (
        prevProps.keyPlay
        && rule1
        && this.state.play
        && !this.state.pause) {
        if (this.props.keyPlay !== this.state.keyPlayer
          && this.props.keyPlay
          && this.state.reproduced > 0
        ) {
          this.props.closedPlayer();
          this.pause();
        }
      }
    } else if (this.props.forcedPause && this.state.play && !this.state.pause) {
      this.pause();
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
    this.props.playAction({
      keyPlayer: this.state.keyPlayer,
      isPlaying: true
    });
    this.player.play(this.state.keyPlayer).then((success) => {
      if (success) {
        this.props.closedPlayer();
        this.setState({ play: false, reproduced: 0, pause: undefined });
      }
    });
  };

  pause = () => {
    this.player.pause(this.state.keyPlayer).then((success) => {
      if (success) {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({ play: false, pause: true });
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

const mapStateToProps = (state) => ({
  isPlaying: state.chats.player,
  keyPlay: state.chats.keyPlayer,
  forcedPause: state.chats.forcedPause,
});

export default connect(mapStateToProps, { playAction, closedPlayer })(Player);
