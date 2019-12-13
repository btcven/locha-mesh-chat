import React, { Component } from "react";
import {
  Drawer,
  Container,
  ListItem,
  Body,
  Left,
  Right,
  Button,
  Icon,
  Thumbnail,
} from "native-base";
import { View, Text, StyleSheet, Image, Platform, NativeModules } from "react-native";
import { connect } from "react-redux";
import { closeMenu } from "../store/aplication/aplicationAction";
import { images } from "../utils/constans";
import NavigationService from "../utils/navigationService";



console.log(
  NativeModules.RNDeviceInfo
)


class DrawerComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = view => {
    NavigationService.navigate(view);
  };

  viewItem = () => {
    return <Text>Hello word</Text>;
  };

  render() {
    const { screenProps } = this.props;

    return (
      <Container>
        <View style={styles.headerDrawer}>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={images.logo.url}
          />

          {this.props.user.image && (
            <Thumbnail
              source={{
                uri: this.props.user.image + "?" + new Date().getDate(),
                cache: "force-cache"
              }}
              style={styles.imageStyle}
            />
          )}

          {!this.props.user.image && (
            <Thumbnail source={images.noPhoto.url} style={styles.imageStyle} />
          )}

          <Text style={styles.textTitle}>{this.props.user.name}</Text>
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
              <Text>{screenProps.t("Drawer:contacts")}</Text>
            </Body>
          </ListItem>

          <ListItem icon button onPress={() => NativeModules.RNDeviceInfo.machineName()}>
            <Left>
              <Button style={{ backgroundColor: "#ef6c00" }}>
                <Icon active name="settings" />
              </Button>
            </Left>
            <Body>
              <Text>{screenProps.t("Drawer:setting")}</Text>
            </Body>
          </ListItem>


        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  menu: state.aplication.menu,
  user: state.config
});

export default connect(mapStateToProps, { closeMenu })(DrawerComponent);

const styles = StyleSheet.create({
  headerDrawer: {
    height: "22%",
    backgroundColor: "#FAB300",
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    height: 60,
    width: 60,
    // borderRadius: 100,
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
