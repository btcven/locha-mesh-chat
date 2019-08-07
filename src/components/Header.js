import React, { Component } from "react";

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Thumbnail
} from "native-base";
import { StyleSheet } from "react-native";

export default class HeaderComponent extends Component {
  render() {
    return (
      <Header style={styles.container} androidStatusBarColor="#00897b">
        <Left />
        <Body>
          <Title>Locha Mesh</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#009688"
  }
});
