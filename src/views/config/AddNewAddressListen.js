
import React, { Component } from 'react';
import { View, StyleSheet, NativeModules } from 'react-native';
import {
  Text, Picker, Button, ListItem, CheckBox, Body
} from 'native-base';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { chatService } from '../../../App';
import { toast } from '../../utils/utils';

class AddNewAddressListen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefaul: true,
      ipInterface: [],
      adressSelected: ''
    };
  }

  componentDidMount = async () => {
    let isDefault = await AsyncStorage.getItem('AddressListen');
    const addressListen = isDefault || '0.0.0.0';
    isDefault ? isDefault = false : isDefault = true;
    const ips = await NativeModules.RNDeviceInfo.getIpv6Andipv4Adress();
    this.setState({
      ipInterface: ips,
      adressSelected: addressListen,
      isDefaul: isDefault
    });
  }


  setDefault = async () => {
    if (!this.state.isDefaul) {
      this.setState({ isDefaul: true, adressSelected: '0.0.0.0' });
    } else {
      this.setState({ isDefaul: false });
    }
  }

  onChangeAddress = (address) => {
    this.setState({
      adressSelected: address
    });
  }

  save = async () => {
    const { screenProps } = this.props;
    chatService.addNewAddressListen(this.state.adressSelected, async (error) => {
      if (error) {
        toast(screenProps.t('Admin:errorSaveListen'));
        return;
      }
      if (!this.state.isDefaul) {
        await AsyncStorage.setItem('AddressListen', this.state.adressSelected);
        toast(screenProps.t('Admin:addressListenMessage1'));
        this.props.close();
      } else {
        await AsyncStorage.removeItem('AddressListen');
        toast(screenProps.t('Admin:addressListenMessage2'));
        this.props.close();
      }
    });
  }

  render() {
    const { screenProps } = this.props;
    const localAddress = ['0.0.0.0'];

    const value = !this.state.isDefaul ? this.state.ipInterface : localAddress;
    return (
      <Modal
        style={{
          justifyContent: 'flex-end',
          margin: 0
        }}
        avoidKeyboard
        isVisible={this.props.open}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationOutTiming={800}
        onBackdropPress={() => this.props.close()}
      >
        <View style={styles.container}>
          <Text>
            {screenProps.t('Admin:AddressListenTitle')}
          </Text>
          <View style={styles.dropDownStyle}>
            <Picker
              enabled={!this.state.isDefaul}
              mode="dropdown"
              selectedValue={this.state.adressSelected}
              onValueChange={this.onChangeAddress}
              style={{ width: '100%' }}
            >
              {value.map((address) => <Picker.Item key={address} label={address} value={address} />)}
            </Picker>
          </View>
          <ListItem>
            <CheckBox color="orange" checked={this.state.isDefaul} onPress={this.setDefault} />
            <Body>
              <Text>{screenProps.t('Admin:default')}</Text>
            </Body>
          </ListItem>

          <View
            style={styles.buttonContainer}
          >
            <Button
              onPress={() => this.props.close()}
              transparent
              style={{
                marginHorizontal: 10
              }}
            >
              <Text style={styles.styleTextButton}>
                {screenProps.t('Initial:back')}
              </Text>
            </Button>
            <Button
              transparent
              onPress={() => this.save()}
              style={styles.styleTextButton}
            >
              <Text>{screenProps.t('Settings:saveButton')}</Text>
            </Button>
          </View>

        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  listenAddress: state.config.nodeAddress
});

export default connect(mapStateToProps, {})(AddNewAddressListen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    minHeight: '30%',
    padding: 20
  },
  titleModal: {
    padding: 20,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: '400'
  },
  dropDownStyle: {
    marginVertical: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 20
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
