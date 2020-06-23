/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { isNull } from 'util';
import {
  Item, Form, Input, Button
} from 'native-base';

export default class WifiConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      ssid: ''
    };
  }


  connect = () => {
    console.warn({
      password: this.state.password,
      ssid: this.state.ssid
    });
  }

  render() {
    const { open } = this.props;
    const openModal = isNull(open) ? false : open;
    return (
      <Modal
        isVisible={openModal}
        style={styles.modalContainer}
        animationIn="slideInUp"
        avoidKeyboard
        animationOut="slideOutDown"
        animationOutTiming={800}
      >
        <View style={{ width: '100%', minHeight: '50%', backgroundColor: 'white' }}>
          <View>
            <Text style={styles.titleModal}>connect to a valid AP </Text>
          </View>
          <Text style={styles.subtitle}>This application to work correctly it is necessary to connect to a network compatible with ipv6, please connect to a valid network.</Text>
          <View>
            <Form>
              <Item stackedLabel>
                <Input
                  placeholder="Enter SSID"
                  value={this.state.ssid}
                  onChangeText={(text) => this.setState({ ssid: text })}
                />
              </Item>

              <Item stackedLabel>
                <Input
                  placeholder="Enter Password"
                  value={this.state.password}
                  secureTextEntry
                  onChangeText={(text) => this.setState({ password: text })}
                />
              </Item>

            </Form>
          </View>
          <View style={styles.footerContainer}>
            <Button transparent style={{ width: '20%' }} onPress={() => this.connect()}>
              <Text style={{ color: 'blue', fontWeight: '400', fontSize: 15 }}>CONNECT</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  styleTextButton: {
    paddingHorizontal: 10
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0
  },
  footerContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'flex-end',
  },
  subtitle: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 15,
    textAlign: 'justify'
  },
  titleModal: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 23,
    fontWeight: '400'
  }
});
