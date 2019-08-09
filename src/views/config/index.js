import React, { Component } from "react";
import { Container, Icon, Left, Right } from "native-base";
import { images } from "../../utils/constans";
import Header from "../../components/Header";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import { getPhotosFromGallery } from "../../store/aplication/aplicationAction";
import { connect } from "react-redux";
import EditName from "./EditName";

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false
    };
  }

  close = () => {
    this.setState({
      openModal: false
    });
  };

  static navigationOptions = {
    header: null
  };

  render() {
   
    return (
      <Container>
        <Header {...this.props} />
        {this.state.openModal && (
          <EditName
            open={this.state.openModal}
            {...this.props}
            close={this.close}
          />
        )}
        <View style={styles.sectionContainer}>
          <View style={styles.imageContainer}>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor="#eeeeee"
              onPress={() => {
                this.setState({ openModal: true });
              }}
            >
              <Image source={images.noPhoto.url} style={styles.imageStyle} />
            </TouchableHighlight>

            <View style={styles.actionButtonContainer}>
              <TouchableHighlight
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 100,
                  justifyContent: "center",
                  display: "flex"
                }}
                underlayColor="#eeeeee"
                onPress={() => {
                  console.log("click");
                }}
              >
                <Icon
                  style={styles.iconStyles}
                  type="MaterialIcons"
                  name="camera-alt"
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Left>
            <Icon
              style={{ color: "#26a69a" }}
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
            <Text style={styles.textLabel}>Nombre</Text>
            <Text style={styles.textInfo}>Kevin Velasco</Text>
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
                console.log("click");
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
      </Container>
    );
  }
}

export default connect(
  null,
  { getPhotosFromGallery }
)(Config);

const styles = StyleSheet.create({
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: '20%',
    paddingBottom: 15,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    marginLeft: 20,
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
    backgroundColor: "#009688",
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
