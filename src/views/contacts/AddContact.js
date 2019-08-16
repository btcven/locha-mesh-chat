import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image
} from "react-native";
import { images } from "../../utils/constans";
import { Icon, Form, Item, Input, Label } from "native-base";
import EditPhoto from "../config/EditPhoto";
import ImagePicker from "react-native-image-crop-picker";

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalPhoto: false,
      image: undefined,
      name: "",
      uid: ""
    };
  }

  close = name => {
    this.setState({ openModalPhoto: false });
  };

  getPhotosFromUser = callback => {
    ImagePicker.openPicker({
      cropping: true,
      width: 500,
      height: 500
    }).then(async images => {
      callback();
      console.log(images);
      this.setState({ image: images.path });
    });
  };

  openCamera = callback => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true
    }).then(async images => {
      this.setState({ image: images.path });
    });
  };

  save = () => {
    const obj={
      name:this.state.name,
      image: this.state.image,
      uid: this.state.uid
    }
    this.props.saveContact(obj)
  };

  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.props.openModal}
          onRequestClose={() => {
            this.props.close();
          }}
        >
          <View style={styles.HeaderModal}>
            {this.state.openModalPhoto && (
              <EditPhoto
                open={this.state.openModalPhoto}
                getPhotosFromUser={this.getPhotosFromUser}
                openCamera={this.openCamera}
                close={this.close}
              />
            )}
            <TouchableOpacity onPress={this.props.close}>
              <Icon
                style={styles.iconStyle}
                type="MaterialIcons"
                name="clear"
              />
            </TouchableOpacity>
            <Text style={styles.textStyle}>Agregar Contacto</Text>
            <TouchableOpacity
             onPress={this.save}
            >
              <Icon
                style={styles.iconStyle}
                type="MaterialIcons"
                name="check"
              />
            </TouchableOpacity>
          </View>

          <View>
            <Form
              style={{
                paddingHorizontal: 10,
                height: "60%",
                minHeight: 270,
                justifyContent: "space-evenly"
              }}
            >
              <Item stackedLabel>
                <Label style={styles.inputStyle}>UID</Label>
                <Input
                  style={styles.inputStyle}
                  value={this.state.uid}
                  onChangeText={text => this.setState({ uid: text })}
                />
              </Item>

              <Item stackedLabel>
                <Label style={styles.inputStyle}>Nombre del contacto</Label>
                <Input
                  value={this.state.name}
                  onChangeText={text => this.setState({ name: text })}
                />
              </Item>
            </Form>
            <View />

            <View
              style={{
                width: "100%",
                alignItems: "center"
              }}
            >
              <View style={styles.imageContainer}>
                {!this.state.image && (
                  <TouchableHighlight
                    style={styles.touchable}
                    underlayColor="#eeeeee"
                    onPress={() => {
                      console.log("click");
                    }}
                  >
                    <Image
                      source={images.noPhoto.url}
                      style={styles.imageStyle}
                    />
                  </TouchableHighlight>
                )}

                {this.state.image && (
                  <TouchableHighlight
                    style={styles.touchable}
                    underlayColor="#eeeeee"
                    onPress={() => {
                      console.log("click");
                    }}
                  >
                    <Image
                      source={{
                        uri: this.state.image + "?" + new Date().getDate(),
                        cache: "force-cache"
                      }}
                      style={styles.imageStyle}
                    />
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
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  HeaderModal: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15
  },

  iconStyle: {
    fontSize: 25,
    fontWeight: "600"
  },

  textStyle: {
    fontWeight: "normal",
    fontSize: 20,
    color: "black"
  },
  touchable: {
    borderRadius: 100
  },

  inputStyle: {},
  imageStyle: {
    height: 130,
    width: 130,
    borderRadius: 100
  },

  imageContainer: {
    width: 150,
    alignItems: "center"
  },
  iconStyles: {
    display: "flex",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 18
  },

  actionButtonContainer: {
    backgroundColor: "#009688",
    height: 45,
    width: 45,
    borderRadius: 100,
    position: "absolute",
    top: "80%",
    left: "36%",
    borderWidth: 0,
    justifyContent: "center"
  }
});
