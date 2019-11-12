import React, { Component } from "react";
import { Container } from "native-base";
import Header from "../../components/Header";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { androidToast } from "../../utils/utils";
import {
  initialChat,
  cleanAllChat,
  sendMessageWithFile,
  deleteMessages,
  setView,
  sendReadMessageStatus,
  sendAgain
} from "../../store/chats";
import {} from "../../store/aplication";
import { connect } from "react-redux";
import { Alert, Clipboard, Dimensions } from "react-native";
import { sha256 } from "js-sha256";
import ImagesView from "./imagesView";

/**
 * main message component
 */

class Chat extends Component {
  /**
   *Creates an instance of Chat.
   * @param {Object} props optional
   * @memberof Chat
   */

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

  /**
   *
   * static variable of the React Navigation
   * @static
   * @memberof Chat
   */
  static navigationOptions = {
    header: null
  };

  /**
   * function belonging to the menu its function is to delete all messages from the selected chat
   * @function
   * @memberof Chat
   */
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

  /**
   * @typedef {Object} Message
   * @property {string} item.fromUID uid of who sends the message
   * @property {string} item.id message id
   * @property {string} item.msg  message text
   * @property {string | null}  item.name name of who send the message
   * @property {number} item.timestamp message timestamp
   * @property {string | null} item.toUID  uid of who receive the message
   * @property {string} item.type type message
   * @property {object} item.file path where the file is saved and file type
   */

  /**
   * function executes when pressing a message
   * @param {Message} item
   * @param {string} item.fromUID uid of who sends the message
   * @param {string} item.id message id
   * @param {string} item.msg  message text
   * @param {string | null}  item.name name of who send the message
   * @param {number} item.timestamp message timestamp
   * @param {string | null} item.toUID  uid of who receive the message
   * @param {string} item.type type message
   * @param {{fileType: string, file: string}} item.file path where the file is saved and file type
   * @function
   * @public
   * @memberof Chat
   */

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
    } else if (item.file && item.file.fileType !== "audio") {
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

  /**
   * function used to select messages
   * @param {Object} item
   * @param {string} item.fromUID uid of who sends the message
   * @param {string} item.id message id
   * @param {string} item.msg  message text
   * @param {string | null}  item.name name of who send the message
   * @param {number} item.timestamp message timestamp
   * @param {string | null} item.toUID  uid of who receive the message
   * @param {string} item.type type message
   * @param {{fileType: string, file: string}} item.file path where the file is saved and file type
   * @function
   * @public
   * @memberof Chat
   */
  onSelected = item => {
    this.setState({
      selected: this.state.selected.concat(item)
    });
  };

  // ----------------- Actions headers  -----------

  back = () => {
    this.setState({ selected: [] });
  };

  copy = () => {
    const selected = this.state.selected;

    Clipboard.setString(selected[this.state.selected.length - 1].msg);
    androidToast("Mensaje copiado");
  };

  delete = () => {
    const chatSelected = this.props.chat[this.props.chatSelected.index];
    this.props.deleteMessages(chatSelected.toUID, this.state.selected, () => {
      this.setState({ selected: [] });
    });
  };

  // -----------------------------------------

  /**
   * open the file selection modal
   * @function
   * @memberof Chat
   */

  openFileModal = () => {
    this.setState({ fileModal: true });
  };

  /**
   * open the file selection modal
   * @function
   * @memberof Chat
   */

  closeFileModal = () => {
    this.setState({ fileModal: false });
  };

  /**
   * Prepare the message structure before being sent
   * @param { obj } data
   * @param {array<obj>} data.images contains the list of images
   * @param {number} data.position array position where the comment will be written
   * @param {string} data.message text to send
   * @function
   * @memberof Chat
   */

  componentWillUnmount = () => {
    this.props.setView(undefined);
  };

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
          sendReadMessageStatus={this.props.sendReadMessageStatus}
          sendAgain={this.props.sendAgain}
        />
        <ChatForm
          user={this.props.userData}
          navigation={navigation.state}
          setChat={this.props.initialChat}
          previousChat={this.props.chatSelected}
          openFileModal={this.openFileModal}
          sendMessagesWithSound={this.props.sendMessageWithFile}
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
  {
    initialChat,
    setView,
    cleanAllChat,
    sendMessageWithFile,
    deleteMessages,
    sendReadMessageStatus,
    sendAgain
  }
)(Chat);
