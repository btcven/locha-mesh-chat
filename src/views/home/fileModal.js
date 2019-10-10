import React, { Component } from "react";
import Modal from "react-native-modal";
import { images } from "../../utils/constans";
import { View, Text, TouchableOpacity } from "react-native";
import { Thumbnail } from "native-base";

/**
 *
 *
 * @export
 * @class EditPhoto
 * @description modal to select the type of file to send
 * @extends {Component}
 */

export default class FileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPhotosFromGallery = () => {
    console.log("click");
  };

  GetphotoFromCamera = () => {
    console.log("click");
  };

  render() {
    const { open, close } = this.props;
    return (
      <View>
        <Modal
          style={{
            justifyContent: "flex-end",
            margin: 10,
            marginBottom: 54
          }}
          isVisible={open}
          onBackdropPress={() => this.props.close()}
          swipeDirection={["up", "left", "right", "down"]}
          backdropOpacity={0}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              height: "20%",
              alignItems: "center",
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                this.getPhotosFromGallery();
              }}
            >
              <Thumbnail source={images.file.url} />
              <Text>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                this.GetphotoFromCamera();
              }}
            >
              <Thumbnail source={images.camera.url} />
              <Text>Camara</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
