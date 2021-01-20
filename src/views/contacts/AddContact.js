import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {
  Icon, Form, Item, Input, Label, Spinner, Thumbnail, Header
} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import QRCodeScanner from 'react-native-qrcode-scanner';
import EditPhoto from '../config/EditPhoto';
import { toast } from '../../utils/utils';
import { images } from '../../utils/constans';
import { bitcoin } from '../../../App';
/**
 *
 * @export
 * @class AddContact
 * @description component where we add the contact information.
 * @extends {Component}
 */

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalPhoto: false,
      image: undefined,
      name: '',
      nodeAddress: '',
      uid: '',
      spinner: true,
      openQrCode: false
    };
  }

  componentDidMount = () => {
    const { selected } = this.props;
    if (selected.length > 0) {
      this.setState({
        name: selected[0].name,
        image: selected[0].picture,
        uid: selected[0].uid,
        nodeAddress: selected[0].nodeAddress
      });
    }
  };

  close = () => {
    this.setState({ openModalPhoto: false });
  };

  getPhotosFromUser = (id, callback) => {
    ImagePicker.openPicker({
      cropping: true,
      width: 500,
      height: 500
    }).then(async (imagesResponse) => {
      callback();
      this.setState({ image: imagesResponse.path });
    });
  };

  openCamera = (id, callback) => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true
    }).then(async (CameraResponse) => {
      callback();
      this.setState({ image: CameraResponse.path });
    });
  };

  save = async () => {
    const update = this.props.selected.length > 0;
    const verify = this.verifyContacts(update);

    const hashUID = await bitcoin.sha256(this.state.uid);
    if (verify) {
      const obj = {
        name: this.state.name,
        picture: this.state.image,
        uid: this.state.uid,
        nodeAddress: this.state.nodeAddress,
        hashUID
      };

      if (!update) {
        this.props.saveContact(
          this.props.userData.uid,
          obj,
          this.props.contacts,
          () => {
            toast(
              this.props.screenProps.t('Contacts:contactSuccessfully')
            );
            this.props.close();
          }
        );
      } else {
        this.props.editContacts(obj, () => {
          toast(
            this.props.screenProps.t('Contacts:contactSuccessfully')
          );
          this.props.close();
        });
      }
    }
  };

  onSuccess = (event) => {
    this.setState({ spinner: false });
    try {
      const result = JSON.parse(event.data);
      if (result.name && result.uid && result.nodeAddress) {
        setTimeout(() => {
          this.setState({
            openQrCode: false,
            uid: result.uid,
            name: result.name,
            nodeAddress: result.nodeAddress
          });
        }, 50);
      } else {
        toast(this.props.screenProps.t('Contacts:invalidFormat'));
      }
    } catch (err) {
      toast(this.props.screenProps.t('Contacts:invalidFormat'));
    }
  };

  verifyContacts = (update) => {
    if (!update) {
      const uidExist = this.props.contacts.find((contact) => contact.name === this.state.uid);

      if (uidExist) {
        toast(this.props.screenProps.t('Contacts:existContact'));
        return false;
      }

      const nameExist = this.props.contacts.find((contact) => contact.name === this.state.name);

      if (nameExist) {
        toast(this.props.screenProps.t('Contacts:existName'));
        return false;
      }
    }
    return true;
  };

  render() {
    const { screenProps } = this.props;
    const disabled1 = this.props.selected.length > 0;
    const disabled2 = !!(this.state.name.length === 0 || this.state.uid.length === 0);

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
          <Header style={styles.HeaderModal} androidStatusBarColor="white">
            {this.state.openModalPhoto && (
              <EditPhoto
                screenProps={screenProps}
                open={this.state.openModalPhoto}
                getPhotosFromUser={this.getPhotosFromUser}
                openCamera={this.openCamera}
                close={this.close}
                config={this.props.userData}
              />
            )}
            {!this.state.openQrCode && (
              <TouchableOpacity onPress={this.props.close}>
                <Icon
                  style={styles.iconStyle}
                  type="MaterialIcons"
                  name="clear"
                />
              </TouchableOpacity>
            )}

            {this.state.openQrCode && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ openQrCode: false });
                }}
              >
                <Icon style={styles.iconStyle} name="arrow-back" />
              </TouchableOpacity>
            )}
            {this.props.selected.length < 1 && (
              <Text style={styles.textStyle}>
                {screenProps.t('Contacts:addContact')}
              </Text>
            )}
            {this.props.selected.length > 0 && (
              <Text style={styles.textStyle}>
                {screenProps.t('Contacts:editContact')}
              </Text>
            )}
            {
              <TouchableOpacity disabled={disabled2} onPress={this.save}>
                <Icon
                  style={styles.iconStyle}
                  type="MaterialIcons"
                  name="check"
                />
              </TouchableOpacity>
            }
          </Header>

          {!this.state.openQrCode && (
            <View>
              <Form
                style={{
                  paddingHorizontal: 10,
                  height: '60%',
                  minHeight: 270,
                  justifyContent: 'space-evenly'
                }}
              >
                <View>
                  <View style={styles.inputStyle}>
                    <Text>{screenProps.t('Contacts:uid')}</Text>

                    <TouchableOpacity
                      style={{
                        position: 'relative'
                      }}
                      onPress={() => this.setState({ openQrCode: true, spinner: true })}
                    >
                      <Icon
                        type="FontAwesome5"
                        style={{
                          fontSize: 14,
                          paddingHorizontal: 10
                        }}
                        name="qrcode"
                      />
                    </TouchableOpacity>
                  </View>
                  <Item style={{ height: 30 }}>
                    <Input
                      disabled={disabled1}
                      value={this.state.uid}
                      style={{ fontSize: 16 }}
                      onChangeText={(text) => this.setState({ uid: text })}
                    />
                  </Item>
                </View>

                <Item stackedLabel>
                  <Label>{screenProps.t('Contacts:name')}</Label>
                  <Input
                    value={this.state.name}
                    onChangeText={(text) => this.setState({ name: text })}
                  />
                </Item>

                <Item stackedLabel>
                  <Label>{screenProps.t('Contacts:nodeAddress')}</Label>
                  <Input
                    value={this.state.nodeAddress}
                    placeholder="/ip4/192.168.0.100/tcp/38191"
                    onChangeText={(text) => this.setState({ nodeAddress: text })}
                  />
                </Item>
              </Form>
              <View />

              <View
                style={{
                  width: '100%',
                  alignItems: 'center'
                }}
              >
                <View style={styles.imageContainer}>
                  {!this.state.image && (
                    <TouchableHighlight
                      style={styles.touchable}
                      underlayColor="#eeeeee"
                    >
                      <Thumbnail
                        source={images.noPhoto.url}
                        style={styles.imageStyle}
                      />
                    </TouchableHighlight>
                  )}

                  {this.state.image && (
                    <TouchableHighlight
                      style={styles.touchable}
                      underlayColor="#eeeeee"
                    >
                      <Thumbnail
                        source={{
                          uri: this.state.image,
                          cache: 'force-cache'
                        }}
                        style={styles.imageStyle}
                      />
                    </TouchableHighlight>
                  )}

                  <View style={styles.actionButtonContainer}>
                    <TouchableOpacity
                      style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: 100,
                        justifyContent: 'center',
                        display: 'flex'
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
          )}

          {this.state.openQrCode && (
            <View style={{ height: '100%' }}>
              {this.state.spinner && (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    position: 'absolute'
                  }}
                >
                  <Spinner />
                  <Text>{screenProps.t('Contacts:wait')}</Text>
                </View>
              )}
              <QRCodeScanner
                onRead={this.onSuccess}
                reactivate
                reactivateTimeout={1000}
                showMarker
              />
            </View>
          )}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  HeaderModal: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white'
  },

  iconStyle: {
    fontSize: 25,
    fontWeight: '600'
  },

  textStyle: {
    fontWeight: 'normal',
    fontSize: 20,
    color: 'black'
  },
  touchable: {

  },

  inputStyle: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  imageStyle: {
    height: 130,
    width: 130,

  },

  imageContainer: {
    width: 150,
    alignItems: 'center'
  },
  iconStyles: {
    display: 'flex',
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    fontSize: 18
  },

  actionButtonContainer: {
    backgroundColor: '#fbc233',
    borderRadius: 100,
    height: 45,
    width: 45,

    position: 'absolute',
    top: '80%',
    left: '36%',
    borderWidth: 0,
    justifyContent: 'center'
  }
});
