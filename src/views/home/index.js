import React, { Component } from "react";
import { chats } from "../../utils/constans";
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

export default class index extends Component {
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
                <ListItem avatar button>
                  <Left>
                    <Thumbnail
                      source={{
                        uri: `${chat.photo}`
                      }}
                    />
                  </Left>
                  <Body>
                    <Text>{chat.senderName}</Text>
                    <Text note>{chat.lastMessage}</Text>
                  </Body>
                  <Right style={{
                      height:'97%'
                  }}>
                    <Text note > 3:43 pm</Text>
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
