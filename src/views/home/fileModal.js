import React, { Component } from 'react';
import Modal from 'react-native-modal';
import {
  View, Text, TouchableOpacity, Dimensions,
} from 'react-native';
import { Thumbnail } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { images } from '../../utils/constans';
import { FileDirectory } from '../../utils/utils';

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

    };
  }

  /**
   *
   * Search the photos in the gallery and send it to the chat image viewer
   * @memberof FileModal
   */

  getPhotosFromGallery = () => {
    ImagePicker.openPicker({
      includeBase64: true,
      width: 400,
      height: 400,
      cropping: true
    }).then((image) => {
      const name = `IMG_${new Date().getTime()}`;
      const newPath = `file://${FileDirectory}/Pictures/IMG_${name}.jpg`;
      RNFS.moveFile(image.path, newPath).then(() => {
        const imagesView = [
          {
            url: newPath,
            base64: image.data,
            name,
            width: Dimensions.get('window').width
          }
        ];
        this.props.setImageView(imagesView);
        this.props.close();
      });
    });
  };

  /**
   *
   * take the photo, cut it, move the application folder and send it in chat image viewer
   * @memberof FileModal
   */

  GetphotoFromCamera = () => {
    this.props.close();
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true
    }).then((image) => {
      const name = `IMG_${new Date().getTime()}`;
      const newPath = `file://${FileDirectory}/Pictures/IMG_${name}.jpg`;
      RNFS.moveFile(image.path, newPath).then(() => {
        const imagesView = [
          {
            url: newPath,
            base64: image.data,
            name,
            width: Dimensions.get('window').width
          }
        ];
        this.props.setImageView(imagesView);
        this.props.close();
      });
    });
  };


  render() {
    const { open, screenProps } = this.props;
    return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            margin: 10,
            marginBottom: 54
          }}
          isVisible={open}
          onBackdropPress={() => this.props.close()}
          swipeDirection={['up', 'left', 'right', 'down']}
          backdropOpacity={0}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              height: '20%',
              alignItems: 'center',
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => {
                this.getPhotosFromGallery();
              }}
            >
              <Thumbnail source={images.file.url} />
              <Text>{screenProps.t('Settings:gallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => {
                this.GetphotoFromCamera();
              }}
            >
              <Thumbnail source={images.camera.url} />
              <Text>{screenProps.t('Settings:camera')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
