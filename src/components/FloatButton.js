import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default class FloatButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.add()}
        style={styles.floatButton}
      >
        <Text style={styles.textButton}> +</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  floatButton: {
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "#fbc233",
    right: 20,
    bottom: 15,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
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
    color: "black",
    marginRight: 6
  }
});
