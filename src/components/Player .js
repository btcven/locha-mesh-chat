import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import Slider from "@react-native-community/slider";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false
    };
  }

  render() {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}
      >
        <TouchableOpacity onPress={() => this.setState({ play: true })}>
          {!this.state.play && (
            <Icon name="play" style={{ color: "#616161" }} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ play: false })}>
          {this.state.play && (
            <Icon name="pause" style={{ color: "#616161" }} />
          )}
        </TouchableOpacity>
        <Slider
          style={{ width: 150 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FAB300"
          thumbTintColor="#FAB300"
        />
      </View>
    );
  }
}
