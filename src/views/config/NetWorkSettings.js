import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Form, Item, Input, Button, Text
} from 'native-base';
import Modal from 'react-native-modal';


export default class NetWorkSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined
    };
  }

  changeNetworkEndPoint = () => {
    this.props.close('network');
    this.props.changeNetworkEndPoint(this.state.name);
  }

  render() {
    const {
      open, close, screenProps, aplication
    } = this.props;
    const disabled = (this.state.name === undefined);
    return (
      <View>
        <Modal
          style={{
            margin: 0,
            justifyContent: 'flex-end'
          }}
          avoidKeyboard
          isVisible={open}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationOutTiming={800}
          onBackdropPress={() => close('network')}
        >
          <View style={{
            minHeight: '40%',
            backgroundColor: 'white',
            borderRadius: 5,
            marginHorizontal: 5
          }}
          >
            <Text style={styles.titleModal}>
              Network settings
            </Text>
            <Text style={{
              paddingHorizontal: 10
            }}
            >
              Welcome to the network configuration,
              here you can change the connection path with the esp32 device or server
            </Text>
            <Form>
              <Text style={{ position: 'absolute', top: '40%', right: '5%' }} />
              <Item stackedLabel>
                <Input
                  placeholder={aplication.wsUrl}
                  value={this.state.name}
                  onChangeText={(event) => this.setState({ name: event })}
                />
              </Item>
            </Form>
            <View
              style={{
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                onPress={() => close('network')}
                transparent
                style={{
                  marginHorizontal: 10
                }}
              >
                <Text style={styles.styleTextButton}>
                  {screenProps.t('Settings:cancelButton')}
                </Text>
              </Button>
              <Button
                transparent
                disabled={disabled}
                onPress={() => this.changeNetworkEndPoint(this.state.name)}
                style={styles.styleTextButton}
              >
                <Text>{screenProps.t('Settings:saveButton')}</Text>
              </Button>
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
  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  },
  iconStyle: {
    fontSize: 24,
    color: 'white'
  }
});
