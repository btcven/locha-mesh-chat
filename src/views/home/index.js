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
  Text
} from "native-base";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Alert } from "react-native";
import { selectedChat, deleteChat } from "../../store/chats";
import { getSelectedColor, unSelect } from "../../utils/utils";
import Moment from "moment";
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
    header: null
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

    return result ? result : chats[0];
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

  closeSelected = () => {
    this.setState({ selected: [] });
  };

  render() {
    const result = this.state.search
      ? Object.values(this.props.chats).filter(chat => {
          return (
            chat.toUID.toLowerCase().includes(this.state.search) ||
            this.getContactInformation(chat).name.includes(this.state.search)
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
          {result.map((chat, key) => {
            const backgroundColor = getSelectedColor(
              this.state.selected,
              chat.toUID
            );
            infoData = this.getContactInformation(chat);
            const messages = Object.values(chat.messages);
            const lastmessage = messages.length
              ? messages[messages.length - 1].msg
              : chats[0].lastMessage;

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
                      <Thumbnail source={chats[0].picture} />
                    </Left>
                    <Body>
                      <Text>{infoData.name}</Text>
                      <Text note>
                        {lastmessage.length > 25
                          ? `${lastmessage}`.substr(0, 25) + `...`
                          : lastmessage}{" "}
                      </Text>
                    </Body>
                    <Right
                      style={{
                        height: "97%"
                      }}
                    >
                      <Text note> {Moment(lasTime).format("LT")}</Text>
                    </Right>
                  </ListItem>
                </List>
              );
            }
          })}
        </Content>
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
