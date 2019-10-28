import React, { Component } from "react";
import { StyleSheet, View, Text, PanResponder, Animated } from "react-native";

export default class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener(value => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },

      onStartShouldSetPanResponderCapture: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.props.onPressIn();
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });

        this.state.pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: (e, gesture) => {
        Animated.event([null, { dx: this.state.pan.x, dy: 0 }])(e, gesture);
        this.props.moveText(this.state.pan);
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.props.onPressOut();

        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 }
        }).start();
      }
    });
  }

  isDropArea(gesture) {
    return gesture.moveY < 200;
  }

  render() {
    return (
      <View style={{ alignItems: "center" }}>{this.renderDraggable()}</View>
    );
  }

  renderDraggable() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    };
    if (this.state.showDraggable) {
      return (
        <Animated.View {...this.panResponder.panHandlers} style={panStyle}>
          {this.props.children}
        </Animated.View>
      );
    }
  }
}
