import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity } from 'react-native';
import { Thumbnail } from 'native-base';
import { images } from '../../utils/constans';

/**
 Reusable component to display the modal with the gallery and camera buttons
*/

class EditPhoto extends Component {
  /**
   *Creates an instance of EditPhoto.
   * @param {Object} props
   * @memberof EditPhoto
   */

  constructor(props) {
    super(props);
    this.state = {};
  }

  getPhotosFromGallery = () => {
    this.props.getPhotosFromUser(this.props.config.uid, () => {
      this.props.close('openModalPhoto');
    });
  };

  GetphotoFromCamera = () => {
    this.props.openCamera(this.props.config.uid, () => {
      this.props.close('openModalPhoto');
    });
  };

  render() {
    const { open, close, screenProps } = this.props;
    return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            margin: 0
          }}
          isVisible={open}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationOutTiming={800}
          onBackdropPress={() => close('openModalPhoto')}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              height: '25%',
              alignItems: 'center',
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

export default EditPhoto;
