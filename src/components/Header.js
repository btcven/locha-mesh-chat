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
import { StyleSheet, TouchableHighlight, TextInput } from "react-native";
import { connect } from "react-redux";
import * as Animatable from "react-native-animatable";
import Menu from "./Menu";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: null,
      routerName: null,
      search: false,
      searchBarFocused: false
    };
  }

  getNameContact = navigation => {
    if (navigation) {
      return navigation.state;
    }
  };

  onChange = () => {
    this.setState({ search: !this.state.search });
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
            this.props.navigation.state.routeName !== "initial" &&
            !this.state.search && (
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
          {!this.state.search && (
            <Body>
              {router.routeName === "initial" && (
                <Title style={{ color: "#fff" }}>Locha Mesh</Title>
              )}
              {router.routeName === "chat" && (
                <Title>
                  {router.params ? router.params.name : "broadcast"}
                </Title>
              )}
            </Body>
          )}
          <Right>
            {this.props.menu && <Menu menu={this.props.menu} />}
            {!this.state.search && this.props.search && (
              <TouchableHighlight
                underlayColor="#eeeeee"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 100
                }}
                onPress={() => this.onChange()}
              >
                <Icon name="search" style={{ fontSize: 24, color: "white" }} />
              </TouchableHighlight>
            )}
          </Right>

          {this.state.search && (
            <Animatable.View
              animation="slideInRight"
              duration={500}
              style={styles.search}
            >
              <Animatable.View
                animation={
                  this.state.searchBarFocused ? "fadeInLeft" : "fadeInRight"
                }
                duration={400}
              >
                <Icon
                  type="MaterialIcons"
                  name={"arrow-back"}
                  style={{ fontSize: 24 }}
                  onPress={() => this.onChange()}
                />
              </Animatable.View>
              <TextInput
                placeholder="Search"
                style={{
                  fontSize: 17,
                  marginTop: 5,
                  marginLeft: 10,
                  width: 100
                }}
                onChangeText={text => this.props.search(text)}
              />
            </Animatable.View>
          )}
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
            {this.props.copy && (
              <TouchableHighlight
                underlayColor="#eeeeee"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 100
                }}
                onPress={this.props.copy}
              >
                <Icon
                  style={styles.iconStyle}
                  type="FontAwesome5"
                  name="copy"
                />
              </TouchableHighlight>
            )}
            {
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
            }

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
  search: {
    height: 45,
    backgroundColor: "white",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 5
  },

  iconStyle: {
    fontSize: 24,
    color: "white"
  }
});
