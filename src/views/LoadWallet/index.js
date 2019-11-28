import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Image
} from "react-native";
import { Form, Input, Item, Label, Icon, Button, Text } from "native-base";
import { setInitialUser, createNewAccount } from "../../store/aplication/aplicationAction";
import { connect } from "react-redux";
import crypto from "crypto";
import Mnemonic from "bitcore-mnemonic";
import { images } from "../../utils/constans";
import CreateAccount from "./CreateAccount";

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
      password: "",
      phrases: null,
      step: 1
    };
  }

  close = step => {
    this.setState({ step: 1 });
  };

  handleSubmit = () => {
    this.setState({ step: 2 });
    // const obj = {
    //   name: this.state.userName,
    //   password: this.state.password
    // };

    // this.props.setInitialUser(obj);
  };

  componentDidMount = async () => {
    const code =  new Mnemonic();
    this.setState({ phrases: code.toString().split(" "), stringPhrases: code.toString() });
  };

  render() {
    const { screenProps } = this.props;
    const restore = this.state.step === 2 ? true : false;

    const disabled =
      this.state.userName.length > 0 && this.state.password.length > 0
        ? false
        : true;

    return (
      <View style={styles.container}>
        {restore && (
          <CreateAccount
            phrases={this.state.phrases}
            close={this.close}
            open={restore}
            stringPhrases={this.state.stringPhrases}
            createNewAccount={this.props.createNewAccount}
          />
        )}
        <>
          <Image
            source={images.logo2.url}
            style={{
              height: 150,
              width: 150,
              borderRadius: 100,
              marginBottom: "10%"
            }}
          />
          <Text style={styles.title}> {screenProps.t("Initial:title")} </Text>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                paddingBottom: 10,
                color: "#424242",
                textAlign: "justify"
              }}
            >
              {screenProps.t("Initial:subtitle")}
            </Text>

            <Text
              style={{
                color: "#424242",
                textAlign: "justify"
              }}
            >
              {screenProps.t("Initial:text")}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingTop: "10%",
              flex: 1
            }}
          >
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-around",
                alignItems: "flex-end",
                flex: 1
              }}
            >
              <Button onPress={this.handleSubmit} transparent>
                <Text style={{ color: "#fbc233", fontWeight: "bold" }}>
                  {screenProps.t("Initial:restore")}
                </Text>
              </Button>

              <Button transparent onPress={this.handleSubmit}>
                <Text style={{ color: "#fbc233", fontWeight: "bold" }}>
                  {screenProps.t("Initial:next")}
                </Text>
              </Button>
            </View>
          </View>
        </>
      </View>
    );
  }
}

export default connect(null, { setInitialUser, createNewAccount })(InitialStep);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0
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
