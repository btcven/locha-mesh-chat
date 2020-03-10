import React, { Component } from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';
import {
  Container, Content, List, ListItem, Left, Right, Icon, Switch
} from 'native-base';
import InputModal from '../../components/inputModal';

export default class settingsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: '',
      placeholder: '',
      secureText: false
    };
  }

  close = () => {
    this.setState({ open: false });
  }

  render() {
    const { deviceInfo, screenProps } = this.props;
    const { open, title, placeholder, secureText } = this.state;
    return (
      <Container>
        <InputModal
          open={open}
          screenProps={screenProps}
          close={this.close}
          title={title}
          placeholder={placeholder}
          size={32}
          secureText={secureText}
        />
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>{screenProps.t('DeviceSettings:deviceTitle')}</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('DeviceSettings:bateryStatus')}</Text>
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
                <Text>{screenProps.t('DeviceSettings:devicename')}</Text>
              </Left>
              <Right>
                <Text>{deviceInfo.device_name}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('DeviceSettings:compilationVersion')}</Text>
              </Left>
              <Right>
                <Text>
                  {deviceInfo.device_version}
                </Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('DeviceSettings:availableMemory')}</Text>
              </Left>
              <Right>
                <Text>
                  {Number(`${deviceInfo.free_memory / 1024}`).toFixed(2)}
                  kB
                </Text>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>{screenProps.t('DeviceSettings:wapTitle')}</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  name:
                  {deviceInfo.ap.ssid}
                </Text>
              </Left>
              <Right>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      open: true,
                      title: screenProps.t('DeviceSettings:changeNameWap'),
                      placeholder: screenProps.t('DeviceSettings:placeholderWap')
                    });
                  }}
                  style={styles.touchable}
                  underlayColor="#eeeeee"
                >
                  <Icon
                    style={styles.editButtonStyle}
                    type="MaterialIcons"
                    name="edit"
                  />
                </TouchableHighlight>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('DeviceSettings:changePassword')}</Text>
              </Left>
              <Right>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      open: true,
                      title: screenProps.t('DeviceSettings:changePasswordWap'),
                      placeholder: screenProps.t('DeviceSettings:placeholderPWapPassword'),
                      secureText: true
                    });
                  }}
                  style={styles.touchable}
                  underlayColor="#eeeeee"
                >
                  <Icon
                    style={styles.editButtonStyle}
                    type="MaterialIcons"
                    name="edit"
                  />
                </TouchableHighlight>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>{screenProps.t('DeviceSettings:wstTitle')}</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  name:
                  {deviceInfo.sta.ssid}
                </Text>
              </Left>
              <Right>
                <TouchableHighlight
                  style={styles.touchable}
                  underlayColor="#eeeeee"
                >
                  <Icon
                    style={styles.editButtonStyle}
                    type="MaterialIcons"
                    name="edit"
                  />
                </TouchableHighlight>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  {screenProps.t('DeviceSettings:active')}
                </Text>
              </Left>
              <Right>
                <Switch value={deviceInfo.sta.enabled} />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  {screenProps.t('DeviceSettings:changePasswordSta')}
                </Text>
              </Left>
              <Right>
                <TouchableHighlight
                  style={styles.touchable}
                  underlayColor="#eeeeee"
                >
                  <Icon
                    style={styles.editButtonStyle}
                    type="MaterialIcons"
                    name="edit"
                  />
                </TouchableHighlight>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100
  },

  editButtonStyle: {
    color: '#bdbdbd',
    fontSize: 20,
    padding: 10,
  }
});
