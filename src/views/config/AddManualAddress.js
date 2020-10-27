import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Form, Item, Input, Button, Text
} from 'native-base';
import Modal from 'react-native-modal';

export default class AddManualAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  /**
   * executed the action for the save new dial
   */
  saveDial = async () => {
    this.props.action(this.state.name, () => {
      this.setState({
        name: ''
      });
    });
  }

  render() {
    const {
      open, close, title, nameComponent, screenProps
    } = this.props;
    const rule = this.state.name.length < 8;
    return (
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
        onBackdropPress={() => close(nameComponent)}
      >

        <View style={styles.container}>
          <Text style={styles.titleModal}>
            {title}
          </Text>
          <Form>
            <Item stackedLabel>
              <Input
                placeholder="enter address"
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
              onPress={() => close(nameComponent)}
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
              disabled={rule}
              onPress={() => this.saveDial()}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    minHeight: '30%'
  },
  titleModal: {
    padding: 20,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: '400'
  }
});
