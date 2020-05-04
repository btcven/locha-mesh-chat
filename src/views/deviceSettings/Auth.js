/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Form, Item, Input, Text
} from 'native-base';
import { View, Button } from 'react-native';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  submitCredentials = () => {
    this.props.authDevice({
      username: this.state.username,
      password: this.state.password
    });
  }

  render() {
    const { username, password } = this.state;
    const disabled = username.length < 8 && password.length < 8;
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ marginLeft: 30, marginRight: 15, marginVertical: 30 }}>
          <Text style={{
            fontSize: 30, color: '#fbc233', fontWeight: '500', marginBottom: 20
          }}
          >
            Log in
          </Text>
          <Text style={{ color: '#9e9e9e' }}>To access the esp32 configuration you must add the username and password, the default username and password is admin.</Text>
        </View>
        <Form style={{ marginHorizontal: 30 }}>
          <Item>
            <Input
              placeholder="Username"
              value={this.state.username}
              onChangeText={(text) => this.setState({ username: text })}
            />
          </Item>
          <View style={{ marginVertical: 10 }} />
          <Item>
            <Input
              placeholder="Password"
              value={this.state.password}
              secureTextEntry
              onChangeText={(text) => this.setState({ password: text })}
            />
          </Item>
        </Form>
        <View style={{ width: '100%', alignItems: 'flex-end' }}>
          <View style={{ paddingVertical: 25, paddingHorizontal: 30 }}>
            <Button title="Login" color="#fbc233" disabled={disabled} onPress={this.submitCredentials} />
          </View>
        </View>
      </View>
    );
  }
}
