import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text } from "react-native";

export default class EditName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { open, close } = this.props;
    console.log(open);
    return (
      <View>
        <Modal isVisible={open} onBackdropPress={close} >
          <View style={{ backgroundColor: "#fff" }}>
            <Text>I am the modal content!</Text>
          </View>
        </Modal>
      </View>
    );
  }
}
