import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  Container, Content, List, ListItem, Left, Right, Icon, Switch
} from 'native-base';
import Header from '../../components/Header';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };


  render() {
    return (
      <Container>
        <Header {...this.props} name="Settings Device" />
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>Device Characteris</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Batery status</Text>
              </Left>
              <Right>
                <Text> 30%</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Device type</Text>
              </Left>
              <Right>
                <Text>ESP32</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Version</Text>
              </Left>
              <Right>
                <Text>0.0.2</Text>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>WAP(WiFi Access Point)</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>name: Locha.io</Text>
              </Left>
              <Right>
                <Icon
                  style={{
                    color: '#bdbdbd',
                    fontSize: 20,
                  }}
                  type="MaterialIcons"
                  name="edit"
                />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Activar</Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Change password</Text>
              </Left>
              <Right>
                <Icon
                  style={{
                    color: '#bdbdbd',
                    fontSize: 20,
                  }}
                  type="MaterialIcons"
                  name="edit"
                />
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>WST(WiFi Station)</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>name: turpial123456</Text>
              </Left>
              <Right>
                <Icon
                  style={{
                    color: '#bdbdbd',
                    fontSize: 20,
                  }}
                  type="MaterialIcons"
                  name="edit"
                />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Activar</Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Change password</Text>
              </Left>
              <Right>
                <Icon
                  style={{
                    color: '#bdbdbd',
                    fontSize: 20,
                  }}
                  type="MaterialIcons"
                  name="edit"
                />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
