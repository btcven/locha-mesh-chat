import React, { Component } from "react";
import { View, Text } from "react-native";
import { Container } from "native-base";
import Header from "../../components/Header";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    header: null
  };

  render() {
    console.log(this.props);
    return (
      <Container>
        <Header {...this.props} />
        <ChatBody />
        <ChatForm />
      </Container>
    );
  }
}
