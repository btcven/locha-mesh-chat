import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet } from 'react-native';
import {
  Item, Input, Form, Button, Text
} from 'native-base';
/**
 *
 *
 * @export
 * @class EditName
 * @description component to edit the username
 * @extends {Component}
 */
export default class InputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  saveName = () => {
    this.props.action(this.state.name, () => {
      this.setState({ name: '' });
      this.props.close();
    });
  };


  close = () => {
    this.props.close();
    this.setState({ name: '' });
  }

  render() {
    const {
      open, screenProps, size, placeholder, title, secureText
    } = this.props;
    const disabled = !(this.state.name.length > 1);
    return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            margin: 0
          }}
          avoidKeyboard
          isVisible={open}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationOutTiming={800}
          onBackdropPress={() => this.close()}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
              marginHorizontal: 5
            }}
          >
            <Text style={styles.titleModal}>
              {title}
            </Text>
            <Form>
              <Text style={{ position: 'absolute', top: '40%', right: '5%' }}>
                {size - this.state.name.length}
              </Text>
              <Item stackedLabel>
                <Input
                  maxLength={size}
                  placeholder={placeholder}
                  value={this.state.name}
                  secureTextEntry={secureText}
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
                onPress={() => this.close()}
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
                onPress={() => this.saveName()}
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
    paddingHorizontal: 20
  },

  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  }
});
