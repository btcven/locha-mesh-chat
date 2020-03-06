/* eslint-disable camelcase */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  Container, Content, List, ListItem, Left, Right, Icon, Switch
} from 'native-base';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import { getDeviceInfo } from '../../store/deviceSettins/deviceSettingsAction';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };


  componentDidMount = () => {
    this.props.getDeviceInfo();
  }


  render() {
    const { deviceInfo } = this.props;
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
                <Text>
                  {deviceInfo.voltage}
                  %
                </Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Device name</Text>
              </Left>
              <Right>
                <Text>{deviceInfo.device_name}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Available memory</Text>
              </Left>
              <Right>
                <Text>
                  {Number(`${deviceInfo.free_memory / 1024}`).toFixed(2)}
                  kB
                </Text>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>WAP(WiFi Access Point)</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  name:
                  {deviceInfo.wap_ssid}
                </Text>
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
                <Text>name: {deviceInfo.st_ssid}</Text>
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

const mapDispatchToProps = (state) => ({
  deviceInfo: state.device
});

export default connect(mapDispatchToProps, { getDeviceInfo })(index);
