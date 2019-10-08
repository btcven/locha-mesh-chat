import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Form, Input, Item, Label, Icon, Button } from "native-base";
import { setInitialUser } from "./store/aplication/aplicationAction";
import { connect } from "react-redux";
/**
 *
 * @description Welcome component when the application is first opened
 * @class InitialStep
 * @extends {Component}
 */
class InitialStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secure: true,
      userName: "",
      password: ""
    };
  }

  handleSubmit = () => {
    const obj = {
      name: this.state.userName,
      password: this.state.password
    };

    this.props.setInitialUser(obj);
  };

  render() {
    const disabled =
      this.state.userName.length > 0 && this.state.password.length > 0
        ? false
        : true;

    return (
      <View style={styles.container}>
        <Text style={styles.title}> Bienvenido </Text>
        <Text
          style={{
            paddingBottom: 10
          }}
        >
          Gracias por usar Locha Mesh, una app que usa red de radio para
          comunicaciones y transacciones de Bitcoin sin internet ni
          electricidad.
        </Text>
        <Text>
          Para continuar por favor ingrese su alias y su contraseña de seguridad
        </Text>

        <View style={{ width: "100%", paddingTop: "20%" }}>
          <Item style={{ marginBottom: 30 }}>
            <Input
              placeholder="Alias"
              value={this.state.userName}
              onChangeText={text => this.setState({ userName: text })}
            />
          </Item>

          <Item>
            <Input
              onSubmitEditing={() => this.handleSubmit()}
              placeholder="password"
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
              secureTextEntry={this.state.secure}
            />
            {this.state.secure && (
              <TouchableOpacity
                onPress={() => this.setState({ secure: false })}
              >
                <Icon active name="eye" />
              </TouchableOpacity>
            )}
            {!this.state.secure && (
              <TouchableOpacity onPress={() => this.setState({ secure: true })}>
                <Icon active name="eye-off" />
              </TouchableOpacity>
            )}
          </Item>

          <View
            style={{
              alignItems: "flex-end",
              paddingVertical: 20
            }}
          >
            <Button
              onPress={this.handleSubmit}
              disabled={disabled}
              style={{
                backgroundColor: "#fbc233"
              }}
            >
              <Text style={{ padding: 6 }}>Continuar</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  null,
  { setInitialUser }
)(InitialStep);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: 20
  },
  title: {
    paddingBottom: 20,
    fontSize: 30,
    color: "#fbc233"
  },

  formContainer: {
    paddingTop: 40
  }
});
