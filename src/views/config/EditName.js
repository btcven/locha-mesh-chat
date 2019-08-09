import React, { Component } from "react";
import Modal from "react-native-modal";
import { images } from "../../utils/constans";
import { View, Text, TouchableOpacity, PermissionsAndroid } from "react-native";
import { Thumbnail } from "native-base";

export default class EditName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPhotosFromGallery = () => {
    this.props.getPhotosFromGallery(() => {
      this.props.navigation.push("gallery");
      this.props.close();
    });
  };

  render() {

    const { open, close } = this.props;
    return (
      <View>
        <Modal
          style={{
            justifyContent: "flex-end",
            margin: 0
          }}
          isVisible={open}
          onBackdropPress={close}
          swipeDirection={["up", "left", "right", "down"]}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              height: "25%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.getPhotosFromGallery();
              }}
            >
              <Thumbnail source={images.file.url} />
              <Text>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Thumbnail source={images.camera.url} />
              <Text>Camara</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
