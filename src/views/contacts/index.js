import React, { Component } from "react";
import { chats , images } from "../../utils/constans";
import {
  Container,
  Header,
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
    console.log("aca", this.props);
    return (
      <Container>
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
