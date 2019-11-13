import React, { Component } from "react";
import { chats } from "../../utils/constans";
// import {} from 'utils'
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Icon
} from "native-base";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Alert, Image, View } from "react-native";
import { selectedChat, deleteChat } from "../../store/chats";
import {
  getSelectedColor,
  unSelect,
  pendingObservable
} from "../../utils/utils";
import Moment from "moment";
import FloatButton from "../../components/FloatButton";
/**
 *
 * @class index
 * @description main component of the home where the list of open chats are
 * @extends {Component}
 *
 */
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }

  static navigationOptions = {
    drawerLabel: "Home"
  };

  componentDidMount = () => {
    pendingObservable();
  };

  selectedChat = (info, obj) => {
    if (this.state.selected.length === 0) {
      const result = this.getContactInformation(obj);
      const contacts = result.name === "broadcast" ? undefined : result;
      this.props.selectedChat(obj);
      this.props.navigation.push("chat", contacts);
      return;
    }

    const selected = unSelect(this.state.selected, obj);

    if (selected.found) {
      this.setState({ selected: selected.data });
    } else {
      this.setState({
        selected: this.state.selected.concat(obj)
      });
    }
  };

  deleteChat = () => {
    Alert.alert(
      "Eliminar Chat",
      "¿Esta seguro de eliminar este chat?",
      [
        {
          text: "Cancel",
          onPress: () => this.setState({ selected: [] }),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () =>
            this.props.deleteChat(this.state.selected, () => {
              this.setState({ selected: [] });
            })
        }
      ],
      { cancelable: false }
    );
  };

  getContactInformation = data => {
    const result = this.props.contacts.find(contact => {
      return data.toUID === contact.hashUID;
    });

    return result ? result : { ...chats[0], picture: null };
  };

  seleted = data => {
    const object = Object.assign({}, data);
    delete object.messages;

    this.setState({
      selected: this.state.selected.concat(data)
    });
  };

  search = text => {
    this.setState({ search: text });
  };

  /**
   *
   * This function is used to return the chat and contact information
   * @param {string} id
   * @returns {object}
   */

  getFilesInfo = typeFile => {
    if (typeFile === "image") {
      return (
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Icon style={{ fontSize: 20, color: "#9e9e9e" }} name="camera" />
          <Text style={{ marginHorizontal: 5 }} note>
            Photo
          </Text>
        </View>
      );
    } else if (typeFile === "audio") {
      return (
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Icon style={{ fontSize: 20, color: "#9e9e9e" }} name="mic" />
          <Text style={{ marginHorizontal: 5 }} note>
            Audio
          </Text>
        </View>
      );
    } else {
      return (
        <Text note>
          {typeFile.length > 25
            ? `${typeFile}`.substr(0, 25) + `...`
            : typeFile}
        </Text>
      );
    }
  };

  getDataTypeMessage = message => {
    if (message.file) {
      return this.getFilesInfo(message.file.fileType);
    } else {
      return this.getFilesInfo(message.msg);
    }
  };

  closeSelected = () => {
    this.setState({ selected: [] });
  };

  orderChats = chats => {
    const sort = chats.sort((a, b) => {
      if (b.toUID !== "broadcast" && a.toUID !== "broadcast") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
    return sort;
  };

  render() {
    const result = this.state.search
      ? Object.values(this.props.chats).filter(chat => {
          return (
            chat.toUID.toLowerCase().includes(this.state.search) ||
            this.getContactInformation(chat)
              .name.toLowerCase()
              .includes(this.state.search.toLowerCase())
          );
        })
      : Object.values(this.props.chats);
    return (
      <Container>
        <Header
          {...this.props}
          {...this.state}
          delete={this.deleteChat}
          back={this.closeSelected}
          search={this.search}
        />

        <Content>
          {this.orderChats(result).map((chat, key) => {
            const queue = chat.queue ? Object.values(chat.queue) : [];

            const backgroundColor = getSelectedColor(
              this.state.selected,
              chat.toUID
            );
            infoData = this.getContactInformation(chat);
            const messages = Object.values(chat.messages);
            const lastmessage = messages.length ? (
              this.getDataTypeMessage(messages[messages.length - 1])
            ) : (
              <Text note> {chats[0].lastMessage} </Text>
            );

            const lasTime = messages.length
              ? Number(messages[messages.length - 1].timestamp)
              : new Date();

            if (messages.length !== 0 || chat.toUID === "broadcast") {
              return (
                <List key={key} style={{ backgroundColor: backgroundColor }}>
                  <ListItem
                    avatar
                    button
                    onPress={() => {
                      this.selectedChat(infoData, chat);
                    }}
                    onLongPress={() => this.seleted(chat)}
                  >
                    <Left>
                      {!infoData.picture && (
                        <Thumbnail source={chats[0].picture} />
                      )}

                      {infoData.picture && (
                        <Thumbnail
                          source={{
                            uri: infoData.picture,
                            cache: "force-cache"
                          }}
                        />
                      )}
                    </Left>
                    <Body>
                      <Text>{infoData.name}</Text>
                      {lastmessage}
                    </Body>
                    <Right
                      style={{
                        height: "97%"
                      }}
                    >
                      <Text note> {Moment(lasTime).format("LT")}</Text>

                      {queue.length > 0 && (
                        <View
                          style={{
                            backgroundColor: "#52b202",
                            width: 25,
                            height: 24,
                            borderRadius: 100,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "10%",
                            marginRight: "10%"
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 14,
                              marginBottom: 2
                            }}
                          >
                            {queue.length}
                          </Text>
                        </View>
                      )}
                    </Right>
                  </ListItem>
                </List>
              );
            }
          })}
        </Content>
        <FloatButton
          add={() => this.props.navigation.push("contacts")}
          icon={
            <Icon
              type="MaterialIcons"
              name="message"
              style={{ fontSize: 24, color: "#f5f5f5" }}
            />
          }
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  chats: state.chats.chat,
  contacts: Object.values(state.contacts.contacts)
});

export default connect(
  mapStateToProps,
  { selectedChat, deleteChat }
)(index);
