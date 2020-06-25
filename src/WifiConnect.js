/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { isNull } from 'util';
import {
  Item, Form, Input, Button, Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { wifiConnect } from './store/aplication/aplicationAction';
import { toast } from './utils/utils';

class WifiConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      ssid: '',
      loading: false
    };
    this.contador = 0;
    this.interval = null;
  }


  connect = () => {
    this.setState({ loading: true });
    this.props.wifiConnect({
      password: this.state.password,
      ssid: this.state.ssid
    }, () => {
      this.interval = setInterval(() => {
        this.contador += 1;
        if (this.contador > 20) {
          clearInterval(this.interval);
          this.contador = 0;
          this.setState({ loading: false });
          toast('connection error');
        } else if (!this.props.open) {
          clearInterval(this.interval);
          this.setState({ loading: false });
          toast('successful connection');
        }
      }, 1000);
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
        {!this.state.loading
          && (
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
                <Button transparent style={{ width: '25%' }} onPress={() => this.connect()}>
                  <Text style={{ color: 'blue', fontWeight: '400', fontSize: 15 }}>CONNECT</Text>
                </Button>
              </View>
            </View>
          )}
        {this.state.loading
          && (
          <View style={{
            width: '100%',
            minHeight: '50%',
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
            <Spinner color="#FAB300" />
          </View>
          )}
      </Modal>
    );
  }
}
export default connect(null, { wifiConnect })(WifiConnect);

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
