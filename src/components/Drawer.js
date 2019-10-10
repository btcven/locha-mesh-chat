import React, { Component } from "react";
import {
  Drawer,
  Container,
  ListItem,
  Body,
  Left,
  Button,
  Icon
} from "native-base";
import { View, Text, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";
import { closeMenu } from "../store/aplication/aplicationAction";
import { images } from "../utils/constans";
import NavigationService from "../utils/navigationService";

class DrawerComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = view => {
    NavigationService.navigate(view);
    this.props.closeMenu();
  };

  render() {
    return (
      <Drawer
        tapToClose={true}
        type="overlay"
        open={this.props.menu}
        content={
          <Container>
            <View style={styles.headerDrawer}>
              <Image
                style={{ width: "100%", height: "100%" }}
                source={images.logo.url}
              />

              <Image
                source={{
                  uri: this.props.user.image + "?" + new Date().getDate(),
                  cache: "force-cache"
                }}
                style={styles.imageStyle}
              />

              <Text style={styles.textTitle}>{this.props.user.name}</Text>

              {/* <Text
                style={{
                  position: "absolute",
                  color: "white",

                  left: 15,
                  bottom: "5%"
                }}
              >
                {`${this.props.user.uid}`.substr(0, 30) + "..."}
              </Text> */}
            </View>

            <View>
              <ListItem itemDivider>
                <Text>Locha Mesh</Text>
              </ListItem>
              <ListItem icon button onPress={() => this.handleChange("contacts")}>
                <Left>
                  <Button style={{ backgroundColor: "#ef6c00" }}>
                    <Icon active name="person" />
                  </Button>
                </Left>
                <Body>
                  <Text>Contactos</Text>
                </Body>
              </ListItem>

              <ListItem icon button onPress={() => this.handleChange("config")}>
                <Left>
                  <Button style={{ backgroundColor: "#ef6c00" }}>
                    <Icon active name="settings" />
                  </Button>
                </Left>
                <Body>
                  <Text>Configuración</Text>
                </Body>
              </ListItem>
            </View>
          </Container>
        }
        onClose={() => this.props.closeMenu()}
      >
        {this.props.children}
      </Drawer>
    );
  }
}

const mapStateToProps = state => ({
  menu: state.aplication.menu,
  user: state.config
});

export default connect(
  mapStateToProps,
  { closeMenu }
)(DrawerComponent);

const styles = StyleSheet.create({
  headerDrawer: {
    height: "22%",
    backgroundColor: "#FAB300",
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    height: 90,
    width: 90,
    borderRadius: 100,
    position: "absolute",
    right: 10,
    top: 15
  },
  textTitle: {
    position: "absolute",
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    bottom: "15%",
    left: 15
  }
});
