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
export default class EditName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  saveName = () => {
    this.props.editName(
      { name: this.state.name, uid: this.props.config.uid },
      () => {
        this.props.close('openModalName');
      }
    );
  };

  render() {
    const { open, close, screenProps } = this.props;
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
          onBackdropPress={() => close('openModalName')}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
              marginHorizontal: 5
            }}
          >
            <Text style={styles.titleModal}>
              {screenProps.t('Settings:editName')}
            </Text>
            <Form>
              <Text style={{ position: 'absolute', top: '40%', right: '5%' }}>
                {12 - this.state.name.length}
              </Text>
              <Item stackedLabel>
                <Input
                  maxLength={12}
                  placeholder={screenProps.t('Settings:enterName')}
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
                onPress={() => close('openModalName')}
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
    paddingHorizontal: 10
  },

  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  }
});
