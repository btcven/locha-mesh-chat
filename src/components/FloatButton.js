import React, { Component } from 'react';
import {
  Text, TouchableOpacity, StyleSheet, View
} from 'react-native';
/**
 *
 *
 * @export
 * @class FloatButtons
 * @description reusable component is a floating button
 * @extends {Component}
 */
export default class FloatButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.props.add()}
          style={styles.floatButton}
        >
          {!this.props.icon && <Text testID="addIcon" style={styles.textButton}> + </Text>}
          {this.props.icon && this.props.icon}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  floatButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    backgroundColor: '#fbc233',
    right: 20,
    bottom: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.8,
    shadowRadius: 100,

    elevation: 3
  },

  textButton: {
    fontSize: 23,
    color: 'black',
    marginRight: 6
  }
});
