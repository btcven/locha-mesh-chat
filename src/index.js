import React, { Component } from "react";
import RouteContainer from "./routes";
import Header from "./components/Header";
import { StyleSheet, View } from "react-native";

export default class DualComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header />
        <RouteContainer  />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
