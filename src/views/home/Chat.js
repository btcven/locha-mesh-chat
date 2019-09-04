import React, { Component } from "react";
import { Container } from "native-base";
import Header from "../../components/Header";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { initialChat } from "../../store/chats";
import { connect } from "react-redux";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    header: null
  };

  componentWillReceiveProp = nextProps => {
    console.log("ejexuto");
  };

  render() {
    const { navigation } = this.props;
    const messages = this.props.chatSelected.messages.length
      ? this.props.chatSelected.messages
      : [];
    return (
      <Container>
        {/* <Header {...this.props} /> */}
        <ChatBody chats={messages} user={this.props.userData} />
        <ChatForm
          user={this.props.userData}
          navigation={navigation.state}
          setChat={this.props.initialChat}
          previousChat={this.props.chatSelected}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.config,
  chat: state.chats.chat,
  chatSelected: state.chats.seletedChat
});

export default connect(
  mapStateToProps,
  { initialChat }
)(Chat);
