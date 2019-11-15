import React, { Component } from "react";
import { Container, Icon, Left, Right } from "native-base";
import { images } from "../../utils/constans";
import Header from "../../components/Header";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Clipboard
} from "react-native";
import {
  getPhotosFromUser,
  openCamera,
  editName
} from "../../store/configuration/congurationAction";
import { connect } from "react-redux";
import EditName from "./EditName";
import EditPhoto from "./EditPhoto";
import ViewQR from "./ViewQR";
import Languajes from "./Language";
import QRCode from "react-native-qrcode-svg";
import { androidToast } from "../../utils/utils";

/**
 * @class Config
 * @extends {Component}
 * @description main configuration component
 *
 */

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalPhoto: false,
      openModalName: false,
      viewQR: false,
      language: false
    };
  }

  close = name => {
    this.setState({
      [name]: false
    });
  };

  static navigationOptions = {
    header: null
  };

  _setContent = async data => {
    Clipboard.setString(data);
    androidToast(this.props.screenProps.t("Settings:uidCody"));
  };

  render() {
    const { screenProps } = this.props;
    return (
      <Container>
        <Header {...this.props} />
        {this.state.openModalPhoto && (
          <EditPhoto
            open={this.state.openModalPhoto}
            {...this.props}
            close={this.close}
          />
        )}
        {this.state.openModalName && (
          <EditName
            open={this.state.openModalName}
            {...this.props}
            close={this.close}
          />
        )}

        <Languajes
          open={this.state.language}
          {...this.props}
          close={this.close}
        />

        {this.state.viewQR && (
          <ViewQR {...this.props} open={this.state.viewQR} close={this.close} />
        )}
        <View style={styles.sectionContainer}>
          <View style={styles.imageContainer}>
            {this.props.config.image && (
              <TouchableHighlight
                style={styles.touchable}
                underlayColor="#eeeeee"
              >
                <Image
                  source={{
                    uri: this.props.config.image + "?" + new Date().getDate(),
                    cache: "force-cache"
                  }}
                  style={styles.imageStyle}
                />
              </TouchableHighlight>
            )}

            {!this.props.config.image && (
              <TouchableHighlight
                style={styles.touchable}
                underlayColor="#eeeeee"
                onPress={() => {
                  this.setState({ openModalPhoto: true });
                }}
              >
                <Image source={images.noPhoto.url} style={styles.imageStyle} />
              </TouchableHighlight>
            )}
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 100,
                  justifyContent: "center",
                  display: "flex"
                }}
                underlayColor="#eeeeee"
                onPress={() => {
                  this.setState({ openModalPhoto: true });
                }}
              >
                <Icon
                  style={styles.iconStyles}
                  type="MaterialIcons"
                  name="camera-alt"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Left>
            <Icon
              style={{ color: "#fbc233" }}
              type="MaterialIcons"
              name="person"
            />
          </Left>
          <View
            style={{
              width: "70%",
              alignContent: "flex-start",
              paddingLeft: 10
            }}
          >
            <Text style={styles.textLabel}>
              {screenProps.t("Settings:name")}
            </Text>
            <Text style={styles.textInfo}>{this.props.config.name}</Text>
          </View>
          <Right
            style={{
              top: 5
            }}
          >
            <TouchableHighlight
              style={styles.touchable}
              underlayColor="#eeeeee"
              onPress={() => {
                this.setState({ openModalName: true });
              }}
            >
              <Icon
                style={{
                  color: "#bdbdbd",
                  fontSize: 25,
                  paddingVertical: 10,
                  paddingHorizontal: 10
                }}
                type="MaterialIcons"
                name="edit"
              />
            </TouchableHighlight>
          </Right>
        </View>

        <View style={styles.infoContainerAddress}>
          <View
            style={{
              width: "90%",
              justifyContent: "flex-end",
              paddingLeft: 10,
              minHeight: 30
            }}
          >
            <Text style={styles.textInfo}>
              {`${this.props.config.uid}`.substr(0, 25)}...
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center"
            }}
          >
            <TouchableHighlight
              style={styles.touchable}
              underlayColor="#eeeeee"
              onPress={() => {
                this.setState({ viewQR: true });
              }}
            >
              <Icon
                style={{
                  color: "#bdbdbd",
                  fontSize: 25
                }}
                type="FontAwesome5"
                name="qrcode"
              />
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.infoContainerAddress}>
          <Left>
            <Icon style={{ color: "#fbc233" }} name="globe" />
          </Left>
          <View
            style={{
              width: "70%",
              alignContent: "flex-start",
              paddingLeft: 10
            }}
          >
            <Text style={styles.textInfo}>
              {screenProps.t("Settings:language")}
            </Text>
          </View>
          <Right
            style={{
              top: 5
            }}
          >
            <TouchableOpacity
              style={styles.touchable}
              underlayColor="#eeeeee"
              onPress={() => {
                this.setState({ language: true });
              }}
            >
              <Icon
                style={{
                  color: "#bdbdbd",
                  fontSize: 25,
                  paddingVertical: 10,
                  paddingHorizontal: 10
                }}
                name="arrow-dropright"
              />
            </TouchableOpacity>
          </Right>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  config: state.config
});

export default connect(mapStateToProps, {
  getPhotosFromUser,
  openCamera,
  editName
})(Config);

const styles = StyleSheet.create({
  qrCodeContainer: {
    alignItems: "center",
    paddingTop: "5%"
  },

  infoContainer: {
    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    marginLeft: 20,
    minHeight: 90,
    marginRight: 20
  },

  infoContainerAddress: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    marginLeft: 20,
    minHeight: 70,
    marginRight: 20
  },

  textLabel: {
    paddingBottom: 3,
    color: "#bdbdbd"
  },
  touchable: {
    borderRadius: 100
  },
  textInfo: {
    fontSize: 16
  },
  imageStyle: {
    height: 130,
    width: 130,
    borderRadius: 100
  },
  sectionContainer: {
    width: "100%",
    alignItems: "flex-end"
  },
  imageContainer: {
    width: 220,
    alignItems: "center",
    paddingVertical: 20
  },
  actionButtonContainer: {
    backgroundColor: "#fbc233",
    height: 45,
    width: 45,
    borderRadius: 100,
    position: "absolute",
    top: "93%",
    right: "40%",
    borderWidth: 0,
    justifyContent: "center"
  },

  iconStyles: {
    display: "flex",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 18
  }
});
