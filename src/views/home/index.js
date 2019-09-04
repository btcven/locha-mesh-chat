import React, { Component } from "react";
import { chats } from "../../utils/constans";
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
//import Bitcoin from 'bitcore-lib'
class index extends Component {
  static navigationOptions = {
    header: null
  };

  selectedChat = obj => {
    this.props.selectedChat(obj);
    this.props.navigation.push("chat");
  };

  render() {
    return (
      <Container>
        <Header {...this.props} />
        <Content>
          {Object.values(this.props.chats).map((chat, key) => {
            return (
              <List key={key}>
                <ListItem
                  avatar
                  button
                  onPress={() => {
                    this.selectedChat(chat);
                  }}
                >
                  <Left>
                    <Thumbnail source={chats[0].photo} />
                  </Left>
                  <Body>
                    <Text>{chats[0].senderName}</Text>
                    <Text note>{chats[0].lastMessage}</Text>
                  </Body>
                  <Right
                    style={{
                      height: "97%"
                    }}
                  >
                    <Text note> 3:47 pm</Text>
                  </Right>
                </ListItem>
              </List>
            );
          })}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  chats: state.chats.chat
});

export default connect(
  mapStateToProps,
  { selectedChat }
)(index);
