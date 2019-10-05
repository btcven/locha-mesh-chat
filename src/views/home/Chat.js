import React, { Component } from "react";
import { Container } from "native-base";
import Header from "../../components/Header";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { androidToast } from "../../utils/utils";
import { initialChat, cleanAllChat } from "../../store/chats";
import { setView } from "../../store/aplication";
import { connect } from "react-redux";
import { Alert, Clipboard } from "react-native";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      menu: [
        {
          label: "Limpiar chat",
          action: () => this.cleanAllMessages(),
          broadcast: true
        }
      ]
    };
  }

  componentDidMount = () => {
    this.props.setView(this.props.chat[this.props.chatSelected.index].toUID);
  };

  static navigationOptions = {
    header: null
  };

  componentWillUnmount = () => {
    this.props.setView(undefined);
  };

  cleanAllMessages = () => {
    const chat = this.props.chat[this.props.chatSelected.index];
    Alert.alert(
      "Eliminar chat",
      "¿Esta seguro de eliminar todos los mensajes?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.props.cleanAllChat(chat.toUID)
        }
      ],
      { cancelable: false }
    );
  };

  onClick = item => {
    if (this.state.selected.length > 0) {
      const result = this.state.selected.filter(selected => {
        return item.id !== selected.id;
      });

      if (result && result.length !== this.state.selected.length) {
        this.setState({
          selected: result
        });
      } else {
        this.setState({ selected: this.state.selected.concat(item) });
      }
    }
  };

  onSelected = item => {
    this.setState({
      selected: this.state.selected.concat(item)
    });
  };

  back = () => {
    this.setState({ selected: [] });
  };

  copy = () => {
    const selected = this.state.selected;

    Clipboard.setString(selected[this.state.selected.length - 1].msg);
    androidToast("Mensaje copiado");
  };

  delete = () => {
    alert("no disponible");
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
        <Header
          {...this.props}
          menu={this.state.menu}
          selected={this.state.selected}
          back={this.back}
          copy={this.copy}
          delete={this.delete}
        />
        <ChatBody
          chats={messages}
          user={this.props.userData}
          contacts={this.props.contact}
          onClick={this.onClick}
          onSelected={this.onSelected}
          selected={this.state.selected}
        />
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
  chatSelected: state.chats.seletedChat,
  contact: Object.values(state.contacts.contacts)
});

export default connect(
  mapStateToProps,
  { initialChat, setView, cleanAllChat }
)(Chat);
