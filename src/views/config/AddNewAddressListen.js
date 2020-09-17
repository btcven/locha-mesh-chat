
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text, Picker, Button, ListItem, CheckBox, Body
} from 'native-base';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';


class AddNewAddressListen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefaul: false
    };
  }

  componentDidMount = async () => {
    const result = await AsyncStorage.getItem('defaultAddresslisten');
    if (result) {
      this.setState({
        isDefaul: true
      });
    }
  }

  setDefault = async () => {
    if (!this.state.isDefaul) {
      await AsyncStorage.setItem('defaultAddresslisten', String(true));
      this.setState({ isDefaul: true });
    } else {
      await AsyncStorage.removeItem('defaultAddresslisten');
      this.setState({ isDefaul: false });
    }
  }

  render() {
    const localAddress = ['0.0.0.0'];
    const value = !this.state.isDefaul ? this.props.listenAddress : localAddress;
    return (
      <Modal
        style={{
          justifyContent: 'flex-end',
          margin: 0
        }}
        avoidKeyboard
        isVisible
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationOutTiming={800}
        onBackdropPress={() => console.log('hi')}
      >
        <View style={styles.container}>
          <Text>
            por favor seleccion un address donde desea escuchar
          </Text>

          <View style={styles.dropDownStyle}>
            <Picker
              enabled={!this.state.isDefaul}
              mode="dropdown"
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
              onPress={() => console.log('save')}
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
              onPress={() => console.log('back')}
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
