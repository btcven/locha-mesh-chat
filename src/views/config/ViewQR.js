import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Text } from 'native-base';

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
    this.state = {};
  }

  render() {
    const { open, close, screenProps } = this.props;
    return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            margin: 0,
            marginBottom: 20
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
              borderRadius: 20
            }}
          >
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={JSON.stringify({
                  name: this.props.config.name,
                  uid: this.props.config.uid
                })}
                color="#424242"
                size={150}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 20,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ textAlign: 'center' }}>
                {screenProps.t('Settings:qrText')}
              </Text>
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
  qrCodeContainer: {
    alignItems: 'center',
    paddingTop: '5%',
    paddingBottom: 20
  },
  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  }
});
