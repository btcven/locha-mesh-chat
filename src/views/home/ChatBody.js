import React, { Component } from "react";
import {Icon} from 'native-base'
import { View, Text, StyleSheet , TextInput  } from "react-native";

export default class ChatBody extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> ChatBody </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#e0f2f1'
  }
});
