import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import {
  Item, Input, Form, Button, Text
} from 'native-base';

export default class AddNewCredentials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      usernameError: '',
      passwordError: '',
      confirmError: '',
      loading: false
    };
  }

  getInput = ({
    size, payload, secure, key, placeholder, error
  }) => (
    <Form key={key}>
      <Text style={{ position: 'absolute', top: '40%', right: '5%' }}>
        {size - payload.length}
      </Text>
      <Item stackedLabel>
        <Input
          maxLength={size}
          placeholder={placeholder}
          secureTextEntry={secure}
          value={payload}
          onChangeText={(text) => this.setState({ [key]: text })}
        />
      </Item>
      {(error.length > 0)
          && (
            <Text style={styles.textError}>
              {error}
            </Text>
          )}
    </Form>
  )

  saveNewCredential = () => {
    const {
      usernameError, passwordError, confirmError, username, password, confirmPassword
    } = this.state;
    if (username === '') {
      this.setState({ usernameError: 'usuario no debe estar vacio' });
    } else if (usernameError !== '') {
      this.setState({ usernameError: '' });
    }

    if (password === '') {
      this.setState({ passwordError: 'password no valido' });
    } else if (passwordError !== '') {
      this.setState({ passwordError: '' });
    }

    if (password !== confirmPassword) {
      this.setState({ confirmError: 'las contraseñas no coinciden' });
    } else if (confirmError !== '') {
      this.setState({ confirmError: '' });
    }

    if (usernameError === '' && passwordError === '' && confirmError === '') {
      this.setState({ loading: true });
      this.props.changeCredentials({
        username,
        password
      }, () => {
        this.setState({ loading: false });
        this.props.close();
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.open !== false && this.props.open === false) {
      this.setState({
        username: '',
        password: '',
        confirmPassword: '',
        usernameError: '',
        passwordError: '',
        confirmError: '',
        loading: false
      });
    }
  }

  render() {
    const { open, close, screenProps } = this.props;
    const {
      usernameError, passwordError, confirmError, username, password, confirmPassword, loading
    } = this.state;
    const params = [
      {
        error: usernameError, size: 20, placeholder: 'Add username', key: 'username', payload: username, secure: false
      },
      {
        error: passwordError, size: 20, key: 'password', placeholder: 'Add Password', payload: password, secure: true
      },
      {
        error: confirmError, size: 20, key: 'confirmPassword', placeholder: 'Confirm Password', payload: confirmPassword, secure: true
      }
    ];
    return (
      <Modal
        style={styles.ModalStyle}
        avoidKeyboard
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationOutTiming={800}
        isVisible={open}
        onBackdropPress={close}
      >
        {!loading && (
          <View style={styles.containerView}>
            <Text style={styles.titleModal}>Add new password</Text>
            <Text style={{ paddingHorizontal: 10 }}>add your credentials carefully, with these you can access the configuration panel of esp32  </Text>
            {params.map((param) => this.getInput({ ...param }))}
            <View style={styles.containerButton}>
              <Button
                transparent
                onPress={close}
              >
                <Text>Back</Text>
              </Button>
              <Button
                transparent
                onPress={this.saveNewCredential}
              >
                <Text>Save</Text>
              </Button>
            </View>
          </View>
        )}
        {loading && (
          <View style={styles.containerLoading}>
            <ActivityIndicator color="#FAB300" size="large" />
          </View>
        )}
      </Modal>
    );
  }
}


const styles = StyleSheet.create({
  containerView: {
    backgroundColor: 'white'
  },
  ModalStyle: {
    justifyContent: 'flex-end',
    margin: 0
  },
  separator: {
    paddingVertical: 10
  },
  textError: {
    color: 'red',
    paddingHorizontal: 13
  },
  containerButton: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'

  },
  containerLoading: {
    minHeight: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },

  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  }
});
