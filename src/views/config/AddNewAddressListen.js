
import React, { Component } from 'react';
import { View, StyleSheet, NativeModules } from 'react-native';
import {
  Text, Picker, Button, ListItem, CheckBox, Body
} from 'native-base';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { chatService } from '../../../App';

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
    const ips = await NativeModules.RNDeviceInfo.getIpv6Andipv4Adress();
    this.setState({
      ipInterface: ips,
      adressSelected: '0.0.0.0'
    });
  }

  setDefault = async () => {
    if (!this.state.isDefaul) {
      this.setState({ isDefaul: true });
    } else {
      this.setState({ isDefaul: false });
    }
  }

  onChangeAddress = (address) => {
    this.setState({
      adressSelected: address
    });
  }

  save = () => {
    chatService.addNewAddressListen(this.state.adressSelected);
  }


  render() {
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
            por favor seleccion un address donde desea escuchar
          </Text>
          <View style={styles.dropDownStyle}>
            <Picker
              enabled={!this.state.isDefaul}
              mode="dropdown"
              selectedValue={this.state.adressSelected}
              onValueChange={this.onChangeAddress}
              style={{ width: '100%' }}
            >
              {value.map((address) => <Picker.Item label={address} value={address} />)}
            </Picker>
          </View>
          <ListItem>
            <CheckBox color="orange" checked={this.state.isDefaul} onPress={this.setDefault} />
            <Body>
              <Text>default</Text>
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
                back
              </Text>
            </Button>
            <Button
              transparent
              onPress={() => this.save()}
              style={styles.styleTextButton}
            >
              <Text>save</Text>
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
