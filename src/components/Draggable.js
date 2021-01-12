/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import {
  PanResponder, Animated, View
} from 'react-native';

export default class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      // eslint-disable-next-line react/no-unused-state
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      // eslint-disable-next-line react/no-unused-state
      opacity: new Animated.Value(1)
    };
    this.init();
  }

  init() {
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener((value) => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },

      onStartShouldSetPanResponderCapture: () => true,
      // eslint-disable-next-line no-dupe-keys
      onPanResponderGrant: () => {
        this.props.onPressIn();
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });

        this.state.pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: (e, gesture) => {
        const postion = this.state.pan.__getValue();
        if (postion.x > -65) {
          this.props.moveText(this.state.pan);
          Animated.event(
            [null, { dx: this.state.pan.x, dy: new Animated.Value(0) }],
            { useNativeDriver: false }
          )(e, gesture);
        } else {
          this.props.onPressOut();
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },

      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        this.props.onPressOut();

        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  isDropArea(gesture) {
    return gesture.moveY < 200;
  }

  // eslint-disable-next-line react/sort-comp
  render() {
    return (
      <View style={{ alignItems: 'center' }}>{this.renderDraggable()}</View>
    );
  }

  // eslint-disable-next-line consistent-return
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
