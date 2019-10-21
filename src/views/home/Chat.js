import React, { Component } from "react";
import { Container } from "native-base";
import Header from "../../components/Header";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { androidToast } from "../../utils/utils";
import {
  initialChat,
  cleanAllChat,
  sendMessageWithFile
} from "../../store/chats";
import { setView } from "../../store/aplication";
import { connect } from "react-redux";
import { Alert, Clipboard, Dimensions } from "react-native";
import { sha256 } from "js-sha256";
import ImagesView from "./imagesView";

/**
 *
 *
 * @class Chat
 * @description main message component
 * @extends {Component}
 */

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      imagesView: [],
      fileModal: false,
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
    console.log("holaaaa");
  };

  // componentWillUnmount = () => {
  //   console.log("willUnmount");
  //   this.props.setView(undefined);
  // };

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
    } else if (item.file) {
      this.setState({
        imagesView: [
          {
            url: item.file.file,
            width: Dimensions.get("window").width
          }
        ]
      });
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

  openFileModal = () => {
    this.setState({ fileModal: true });
  };

  closeFileModal = () => {
    this.setState({ fileModal: false });
  };

  /**
   * Prepare the message structure before being sent
   * @param { obj } data
   * @param {array<obj>} data.images contains the list of images
   * @param {number} data.position array position where the comment will be written
   * @param {string} data.message
   * @memberof Chat text to send
   */

  sendFileWithImage = (data, callback) => {
    const { userData, navigation, setChat, previousChat } = this.props;
    const toUID = navigation.state.params
      ? navigation.state.params.hashUID
      : null;
    const sendObject = {
      fromUID: sha256(userData.uid),
      toUID: toUID,
      msg: {
        text: ""
      },
      timestamp: new Date().getTime(),
      type: "msg"
    };
    data.images.map((image, key) => {
      const id = sha256(
        `${sha256(userData.uid)} + ${toUID}  +  ${sendObject.msg.text +
          sendObject.msg.file}  + ${new Date().getTime()}`
      );
      if (data.position === key) {
        const sendData = Object.assign({}, sendObject);

        sendData.msg = {
          text: data.message,
          typeFile: "image"
        };

        this.props.sendMessageWithFile(
          { ...sendData, msgID: id },
          image.url,
          image.base64
        );
      } else {
        const sendData = Object.assign({}, sendObject);
        sendData.msg.text = "";
        sendData.msg.file = image.base64;
        sendData.msg.typeFile = "image";
        this.props.sendMessageWithFile(
          { ...sendData, msgID: id },
          image.url,
          image.base64
        );
      }

      if (data.images.length === key + 1) {
        callback();
        this.closeFileModal();
      }
    });
  };

  closeView = () => {
    this.setState({ imagesView: [] });
  };

  render() {
    const { navigation } = this.props;
    let viewImages = this.state.imagesView.length === 0 ? false : true;
    const chatSelected = this.props.chat[this.props.chatSelected.index];

    const messages = Object.values(chatSelected.messages).length
      ? Object.values(chatSelected.messages).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        })
      : [];
    return (
      <Container>
        {viewImages && (
          <ImagesView
            open={viewImages}
            images={this.state.imagesView}
            close={this.closeView}
          />
        )}
        <Header
          {...this.props}
          menu={this.state.menu}
          selected={this.state.selected}
          back={this.back}
          copy={this.copy}
          delete={this.delete}
          setView={this.props.setView}
        />
        <ChatBody
          chats={messages}
          user={this.props.userData}
          contacts={this.props.contact}
          onClick={this.onClick}
          onSelected={this.onSelected}
          selected={this.state.selected}
          close={this.closeFileModal}
          open={this.state.fileModal}
          sendFileWithImage={this.sendFileWithImage}
        />
        <ChatForm
          user={this.props.userData}
          navigation={navigation.state}
          setChat={this.props.initialChat}
          previousChat={this.props.chatSelected}
          openFileModal={this.openFileModal}
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
  { initialChat, setView, cleanAllChat, sendMessageWithFile }
)(Chat);
