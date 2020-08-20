/* eslint-disable no-alert */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Text, TouchableHighlight, StyleSheet, View
} from 'react-native';
import {
  Container, Content, List, ListItem, Left, Right, Icon,
} from 'native-base';

/**
 * component where is the views of the esp32 configuration panel
 */
export default class settingsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: '',
      placeholder: '',
      secureText: false,

      openCredential: false
    };
  }

  /**
   * function that closes the modal
   * @memberof settingsPanel
   */
  close = () => {
    this.setState({ open: false });
  }

  /**
  * function to change the name of the wap
  * @param {String} name name to change
  * @param {Callback}
  * @memberof settingsPanel
  */
  wapName = (name, callback) => {
    const sendObject = {
      ssid: name,
      password: null
    };
    this.props.setApConfig(sendObject);
    callback();
  }


  /**
  * function to change the password of the wap
  * @param {String} password password to change
  * @param {Callback}
  * @memberof settingsPanel
  */
  wapPassword = (password, callback) => {
    const sendObject = {
      ssid: null,
      password
    };
    this.props.setApConfig(sendObject);
    callback();
  }


  /**
  * function to change the name of the sta
  * @param {String} name name to change
  * @param {Callback}
  * @memberof settingsPanel
  */
  staName = (name, callback) => {
    const sendObject = {
      ssid: name,
      password: null,
    };
    this.props.setStaSettings(sendObject);
    callback();
  }

  /**
  * function to change the password of the sta
  * @param {String} password password to change
  * @param {Callback}
  * @memberof settingsPanel
  */
  staPasword = (password, callback) => {
    const sendObject = {
      ssid: null,
      password
    };
    this.props.setStaSettings(sendObject);
    callback();
  }


  /**
  * function to activate and deactivate the sta
  * @memberof settingsPanel
  */
  activeOrDesactivateSta = () => {
    const sendObject = {
      ssid: null,
      password: null,
      enable: true
    };

    if (this.props.deviceInfo.sta.enabled) {
      sendObject.enable = false;
    }
    this.props.activateOrDesactivate(sendObject);
  }

  /**
   * returns the correct function to use
   * @returns {()=>void}
   */
  getActionFunction = () => {
    const { title } = this.state;
    const { screenProps } = this.props;
    switch (title) {
      case screenProps.t('DeviceSettings:changeNameWap'):
        return this.wapName;
      case screenProps.t('DeviceSettings:changePasswordWap'):
        return this.wapPassword;
      case screenProps.t('DeviceSettings:changeNameSta'):
        return this.staName;
      case screenProps.t('DeviceSettings:changePasswordSta'):
        return this.staPasword;
      default:
        return null;
    }
  }

  componentDidUpdate = () => {
    if (this.state.open === true) {
      alert('not avaliable');
      this.setState({ open: false });
    }

    if (this.state.openCredential === true) {
      alert('not avaliable');
      this.setState({ openCredential: false });
    }
  }

  closeModalCredential = () => {
    this.setState({
      openCredential: false
    });
  }

  render() {
    const { deviceInfo, screenProps } = this.props;
    return (
      <Container>
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
              <View>
                <Text>{deviceInfo.device_name}</Text>
              </View>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('DeviceSettings:compilationVersion')}</Text>
              </Left>
              <View>
                <Text>
                  {deviceInfo.device_version}
                </Text>
              </View>
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
              <Text>{screenProps.t('DeviceSettings:credentialTitle')}</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  {screenProps.t('DeviceSettings:ChangeCredencial')}
                </Text>
              </Left>
              <Right>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      openCredential: true
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
                      placeholder: screenProps.t('DeviceSettings:placeholderWap'),
                      secureText: false
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
