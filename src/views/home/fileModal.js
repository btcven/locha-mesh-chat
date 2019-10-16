import React, { Component } from "react";
import Modal from "react-native-modal";
import { images } from "../../utils/constans";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Thumbnail } from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import ImagesView from "./imagesView";

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
    this.state = {
      imagesView: []
    };
  }

  getPhotosFromGallery = () => {
    imageArray = [];
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true
    }).then(image => {
      image.forEach(data => {
        imageArray.push({
          url: data.path,
          base64: data.data,
          width: Dimensions.get("window").width
        });
      });
      this.setState({ imagesView: imageArray });
    });
  };

  GetphotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true
    }).then(image => {
      console.log("en la image", image);
    });
  };

  closeView = () => {
    this.setState({ imagesView: [] });
  };

  render() {
    const { open, close } = this.props;
    let { imagesView } = this.state;
    let viewImages = imagesView.length === 0 ? false : true;
    return (
      <View>
        {viewImages && (
          <ImagesView
            sendFileWithImage={this.props.sendFileWithImage}
            open={viewImages}
            images={imagesView}
            close={this.closeView}
          />
        )}
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
