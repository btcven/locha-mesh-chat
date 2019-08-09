import React, { Component } from "react";
import { chats, images } from "../../utils/constans";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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

export default class Contacts extends Component {
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
                <ListItem button>
                  <Left>
                    <Text>{chat.senderName}</Text>
                  </Left>
                  <Right>
                    <Thumbnail
                      source={{
                        uri: `${chat.photo}`
                      }}
                    />
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
