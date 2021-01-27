import React, { Component } from 'react';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import {
  Alert, Clipboard, Dimensions, KeyboardAvoidingView, Platform, View, NativeModules
} from 'react-native';
import { verifyImage } from '../../store/contacts/contactsActions';
import Header from '../../components/Header';
import ChatBody from './ChatBody';
import ChatForm from './ChatForm';
import { FileDirectory, toast } from '../../utils/utils';
import {
  initialChat,
  cleanAllChat,
  sendMessageWithFile,
  deleteMessages,
  setView,
  sendReadMessageStatus,
  sendAgain,
  setNewDials,
  stopPlaying,
  getMoreMessages
} from '../../store/chats/chatAction';
import { messageType } from '../../utils/constans';
import FileModal from './fileModal';
import ImagesView from './imagesView';
import { bitcoin } from '../../../App';


const ChatContainer = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View
})();

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

    this.interval = null;
    this.state = {
      selected: [],
      imagesView: [],
      fileModal: false,
      menu: [
        {
          label: `${this.props.screenProps.t('Chats:clean')}`,
          action: (data) => this.cleanAllMessages(data),
          broadcast: true
        }
      ]
    };
  }


  componentDidMount = () => {
    const { params } = this.props.navigation.state;
    try {
      const contactNodeAddress = params.contacts.noneAddress;
      this.props.setView(params.chatUID, contactNodeAddress);
    } catch (err) {
      this.props.setView(params.chatUID, null);
    }
  };

  /**
   *
   * static variable of the React Navigation
   * @static
   * @memberof Chat
   */
  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  /**
   * function belonging to the menu its function is to delete all messages from the selected chat
   * @function
   * @memberof Chat
   */
  cleanAllMessages = (close) => {
    const { screenProps } = this.props;
    const { params } = this.props.navigation.state;
    Alert.alert(
      `${screenProps.t('Chats:titleDelete')}`,
      `${screenProps.t('Chats:deleteBody')}`,
      [
        {
          text: 'Cancel',
          onPress: () => { close(); },
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => this.props.cleanAllChat(params.chatUID)
        }
      ],
      { cancelable: false }
    );
  };

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
  onClick = (item) => {
    if (this.state.selected.length > 0) {
      const result = this.state.selected.filter((selected) => item.id !== selected.id);

      if (result && result.length !== this.state.selected.length) {
        this.setState({
          selected: result
        });
      } else {
        this.setState({ selected: this.state.selected.concat(item) });
      }
    } else if (item.file && item.file.fileType !== 'audio') {
      this.setState({
        onlyView: true,
        imagesView: [
          {
            url: item.file.file,
            width: Dimensions.get('window').width
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
  onSelected = (item) => {
    this.setState({
      selected: this.state.selected.concat(item)
    });
  };

  // ----------------- Actions headers  -----------

  back = () => {
    this.setState({ selected: [] });
  };

  copy = () => {
    const { selected } = this.state;

    Clipboard.setString(selected[this.state.selected.length - 1].msg);
    this.setState({ selected: [] });
    toast('Mensaje copiado');
  };

  delete = () => {
    const { params } = this.props.navigation.state;
    this.props.deleteMessages(params.chatUID, this.state.selected, () => {
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
    if (!this.props.forcedPause) {
      this.props.stopPlaying(true);
    }
  };

  /**
   * open the file selection modal
   * @function
   * @memberof Chat
   */
  closeFileModal = () => {
    this.setState({ fileModal: false });
    if (this.props.forcedPause) {
      this.props.stopPlaying(false);
    }
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

  sendFileWithImage = async (data, callback) => {
    const { userData, navigation } = this.props;
    const { params } = navigation.state;
    const toUID = params.chatUID;
    const sendObject = {
      fromUID: userData.peerID,
      toUID,
      msg: {
        text: data.message,
        file: 'test',
        typeFile: 'image'
      },
      timestamp: new Date().getTime(),
      type: messageType.MESSAGE
    };

    const id = await bitcoin.sha256(
      `${userData.peerID} + ${toUID}  +  ${sendObject.msg.text
      + sendObject.msg.file}  + ${new Date().getTime()}`
    );

    NativeModules.RNDeviceInfo.scanFile(`${FileDirectory}/Pictures/${data.name}.jpg`);
    this.props.sendMessageWithFile(
      userData.peerID,
      { ...sendObject, msgID: id },
      data.url,
      data.base64
    );

    callback();
    this.closeFileModal();
  };

  closeView = () => {
    this.setState({ imagesView: [], onlyView: false });
  };

  setImageView = (imageArray) => {
    this.setState({ imagesView: imageArray });
  }


  render() {
    const { navigation, screenProps } = this.props;
    const viewImages = this.state.imagesView.length !== 0;

    const messages = Object.values(this.props.chat).length
      ? Object.values(this.props.chat)
      : [];

    return (
      <Container>
        <FileModal
          open={this.state.fileModal}
          close={this.closeFileModal}
          sendFileWithImage={this.sendFileWithImage}
          screenProps={screenProps}
          setImageView={this.setImageView}
        />

        <Header
          {...this.props}
          menu={this.state.menu}
          selected={this.state.selected}
          back={this.back}
          copy={this.copy}
          delete={this.delete}
        />
        <ChatContainer behavior="padding" style={{ flex: 1 }}>
          <ChatBody
            chats={messages}
            user={this.props.userData}
            contacts={this.props.contact}
            onClick={this.onClick}
            onlyView={this.state.onlyView}
            onSelected={this.onSelected}
            selected={this.state.selected}
            close={this.closeFileModal}
            open={this.state.fileModal}
            sendFileWithImage={this.sendFileWithImage}
            closeView={this.closeView}
            sendReadMessageStatus={this.props.sendReadMessageStatus}
            sendAgain={this.props.sendAgain}
            getMoreMessages={this.props.getMoreMessages}
            screenProps={screenProps}
            imagesView={this.state.imagesView}
          />
          <ChatForm
            user={this.props.userData}
            navigation={navigation.state}
            setChat={this.props.initialChat}
            previousChat={this.props.chatSelected}
            openFileModal={this.openFileModal}
            sendMessagesWithSound={this.props.sendMessageWithFile}
            screenProps={screenProps}
          />
        </ChatContainer>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.config,
  chat: state.chats.insideChat,
  chatSelected: state.chats.seletedChat,
  forcedPause: state.chats.forcedPause,
  contact: Object.values(state.contacts.contacts)
});

export default connect(mapStateToProps, {
  initialChat,
  setView,
  cleanAllChat,
  sendMessageWithFile,
  deleteMessages,
  sendReadMessageStatus,
  sendAgain,
  verifyImage,
  stopPlaying,
  setNewDials,
  getMoreMessages
})(Chat);
