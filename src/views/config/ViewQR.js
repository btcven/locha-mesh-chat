import React, { Component } from 'react';
import Modal from 'react-native-modal';
import {
  View, StyleSheet, TouchableOpacity, Clipboard
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Text, Form,  } from 'native-base';
import { toast } from '../../utils/utils';

/**
 *
 *
 * @export
 * @class EditName
 * @description component to edit the username
 * @extends {Component}
 */
export default class ViewQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    };
  }


  componentDidMount = () => {
    if (this.props.config.nodeAddress) {
      this.setState({
        address: this.props.config.nodeAddress[0]
      });
    }
  }


  setContent = async (data) => {
    Clipboard.setString(data);
    toast(this.props.screenProps.t('Settings:uidCopy'));
  };

  onValueChange = (data) => {
    this.setState({
      address: data
    });
  }

  render() {
    const { open, close, screenProps } = this.props;
    return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            height: '60%',
            margin: 0,
          }}
          avoidKeyboard
          isVisible={open}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationOutTiming={800}
          onBackdropPress={() => close('viewQR')}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5
            }}
          >
            <View style={styles.infomationContainer}>
              <View style={styles.containerTitle}>
                <Text style={styles.TitleStyle}>
                  Peer id
                </Text>
              </View>
              <View style={styles.peerIdContainer}>
                <TouchableOpacity onPress={() => this.setContent(this.props.config.peerID)}>
                  <Text>
                    {this.props.config.peerID}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dropDownStyle}>
                {/* <Picker
                  mode="dropdown"
                  selectedValue={this.state.address}
                  onValueChange={this.onValueChange}
                  style={{ width: '100%' }}
                >
                  {this.props.config.nodeAddress.map((address) => (
                    <Picker.Item
                      key={address}
                      label={address}
                      value={address}
                    />
                  ))}
                </Picker> */}
              </View>


            </View>
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={JSON.stringify({
                  name: this.props.config.name,
                  uid: this.props.config.peerID,
                  nodeAddress: this.state.address
                })}
                color="#424242"
                size={150}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleTextButton: {
    paddingHorizontal: 10
  },
  containerTitle: {
    paddingHorizontal: 23,
    paddingBottom: 5,
    paddingTop: 10
  },
  dropDownStyle: {
    marginVertical: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 20
  },
  TitleStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#757575'
  },
  qrCodeContainer: {
    alignItems: 'center',
    paddingTop: '5%',
    paddingBottom: 20
  },
  infomationContainer: {
    justifyContent: 'center'
  },
  peerIdContainer: {
    width: '80%',
    marginHorizontal: 20,
    backgroundColor: '#eeeeee',
    padding: 10
  },
  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  }
});
