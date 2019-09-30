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
import { selectedChat } from "../../store/chats";
import Moment from "moment";
//import Bitcoin from 'bitcore-lib'
class index extends Component {
  static navigationOptions = {
    header: null
  };

  selectedChat = (info, obj) => {
    const result = this.getContactInformation(obj);
    const contacts = result.name === "broadcast" ? undefined : result;
    this.props.selectedChat(obj);
    this.props.navigation.push("chat", contacts);
  };

  getContactInformation = data => {
    const result = this.props.contacts.find(contact => {
      return data.toUID === contact.hashUID;
    });

    return result ? result : chats[0];
  };

  render() {
    return (
      <Container>
        <Header {...this.props} />
        <Content>
          {Object.values(this.props.chats).map((chat, key) => {
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
                <List key={key}>
                  <ListItem
                    avatar
                    button
                    onPress={() => {
                      this.selectedChat(infoData, chat);
                    }}
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
  { selectedChat }
)(index);
