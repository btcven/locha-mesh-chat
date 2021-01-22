import React, { Component } from 'react';
import {
  Form, Text, Item, Input
} from 'native-base';
import { View } from 'react-native';

export default class AddName extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { screenProps, setName, name } = this.props;
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          marginHorizontal: 5
        }}
      >
        <Form>
          <Text style={{ position: 'absolute', top: '40%', right: '5%' }}>
            {12 - name.length}
          </Text>
          <Item stackedLabel>
            <Input
              maxLength={12}
              placeholder={screenProps.t('Settings:enterName')}
              value={name}
              onChangeText={(event) => setName(event)}
            />
          </Item>
        </Form>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        />
      </View>
    );
  }
}
