import React, { Component } from "react";

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Thumbnail,
  Button,
  Icon
} from "native-base";
import { StyleSheet, TouchableHighlight } from "react-native";
import { connect } from "react-redux";
class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: null,
      routerName: null
    };
  }

  getNameContact = navigation => {
    if (navigation) {
      return navigation.state;
    }
  };

  render() {
    const router = this.getNameContact(this.props.navigation);
    const selected = this.props.selected
      ? this.props.selected.length < 1
        ? true
        : false
      : true;
    if (selected) {
      return (
        <Header
          style={styles.container}
          androidStatusBarColor={this.props.modal ? "white" : "#af7d00"}
        >
          {this.props.navigation &&
            this.props.navigation.state.routeName !== "initial" && (
              <Left>
                <TouchableHighlight
                  underlayColor="#eeeeee"
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 100
                  }}
                  onPress={() => {
                    this.props.navigation.pop();
                  }}
                >
                  <Icon style={styles.iconStyle} name="arrow-back" />
                </TouchableHighlight>
              </Left>
            )}
          <Body>
            {router.routeName === "initial" && (
              <Title style={{ color: "#fff" }}>Locha Mesh</Title>
            )}
            {router.routeName === "chat" && (
              <Title>{router.params ? router.params.name : "broadcast"}</Title>
            )}
          </Body>
          <Right />
        </Header>
      );
    } else {
      return (
        <Header
          style={styles.container}
          androidStatusBarColor={this.props.modal ? "white" : "#af7d00"}
        >
          <Left>
            <TouchableHighlight
              onPress={this.props.back}
              underlayColor="#eeeeee"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 100
              }}
            >
              <Icon name="arrow-back" style={styles.iconStyle} />
            </TouchableHighlight>
          </Left>
          <Body>
            {this.props.selected.length === 1 ? (
              <Title>{this.props.selected[0].name}</Title>
            ) : (
              <Title>{this.props.selected.length}</Title>
            )}
          </Body>
          <Right>
            <TouchableHighlight
              underlayColor="#eeeeee"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 100
              }}
              onPress={this.props.delete}
            >
              <Icon style={styles.iconStyle} name="trash" />
            </TouchableHighlight>
            {this.props.selected.length === 1 && this.props.edit && (
              <TouchableHighlight
                underlayColor="#eeeeee"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 100
                }}
                onPress={this.props.edit}
              >
                <Icon style={styles.iconStyle} name="create" />
              </TouchableHighlight>
            )}
          </Right>
        </Header>
      );
    }
  }
}

const mapStateToProps = state => ({
  aplication: state.aplication,
  other: state.nav
});

export default connect(
  mapStateToProps,
  null
)(HeaderComponent);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FAB300"
  },

  iconStyle: {
    fontSize: 24,
    color: "white"
  }
});
