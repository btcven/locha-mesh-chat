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
//import Bitcoin from 'bitcore-lib'
export default class index extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container>
        <Header {...this.props} />
        <Content>
          {chats.map((chat, key) => {
            return (
              <List key={key}>
                <ListItem avatar button>
                  <Left>
                    <Thumbnail
                      source={chat.photo}
                    />
                  </Left>
                  <Body>
                    <Text>{chat.senderName}</Text>
                    <Text note>{chat.lastMessage}</Text>
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