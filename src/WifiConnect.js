/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { isNull } from 'util';
import {
  Item, Form, Input, Button, Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { wifiConnect, manualConnection } from './store/aplication/aplicationAction';
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
        if (this.contador > 15) {
          clearInterval(this.interval);
          this.contador = 0;
          this.setState({ loading: false });
          toast(`${this.props.screenProps.t('WifiConnect:connectionError')}`);
        } else if (!this.props.open) {
          clearInterval(this.interval);
          this.setState({ loading: false });
          toast('WifiConnect:successfulConnection');
        }
      }, 2000);
    });
  }

  render() {
    const { open, screenProps } = this.props;
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
                <Text style={styles.titleModal}>{screenProps.t('WifiConnect:title')}</Text>
              </View>
              <Text style={styles.subtitle}>{screenProps.t('WifiConnect:subtitle')}</Text>
              <View>
                <Form>
                  <Item stackedLabel>
                    <Input
                      placeholder={`${screenProps.t('WifiConnect:inputSSID')}`}
                      value={this.state.ssid}
                      onChangeText={(text) => this.setState({ ssid: text })}
                    />
                  </Item>

                  <Item stackedLabel>
                    <Input
                      placeholder={`${screenProps.t('WifiConnect:inputPassword')}`}
                      value={this.state.password}
                      secureTextEntry
                      onChangeText={(text) => this.setState({ password: text })}
                    />
                  </Item>

                </Form>
              </View>
              <View style={styles.footerContainer}>

                <Button transparent style={{ width: '25%' }} onPress={() => this.props.manualConnection()}>
                  <Text style={{ color: 'blue', fontWeight: '400', fontSize: 15 }}>{screenProps.t('WifiConnect:buttonCancel')}</Text>
                </Button>

                <Button transparent style={{ width: '25%' }} onPress={() => this.connect()}>
                  <Text style={{ color: 'blue', fontWeight: '400', fontSize: 15 }}>{screenProps.t('WifiConnect:buttonConnect')}</Text>
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
export default connect(null, { wifiConnect, manualConnection })(WifiConnect);

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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
