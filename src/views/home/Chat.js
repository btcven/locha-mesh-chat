import React, { Component } from "react";
import { Container } from "native-base";
import Header from "../../components/Header";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { initialChat } from "../../store/chats";
import { setView } from "../../store/aplication";
import { connect } from "react-redux";
import { notify } from "../../index";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.props.setView("chat");
    notify.cancelAll();
  };

  static navigationOptions = {
    header: null
  };

  componentWillUnmount = () => {
    this.props.setView(undefined);
  };

  render() {
    const { navigation } = this.props;

    const chatSelected = this.props.chat[this.props.chatSelected.index];

    const messages = Object.values(chatSelected.messages).length
      ? Object.values(chatSelected.messages).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        })
      : [];
    return (
      <Container>
        <Header {...this.props} />
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
  { initialChat, setView }
)(Chat);
