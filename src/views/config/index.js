import React, { Component } from 'react';
import {
  Container, Icon, Left, Right, Thumbnail
} from 'native-base';
import {
  Text, View, StyleSheet, TouchableHighlight, TouchableOpacity, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import { images } from '../../utils/constans';
import Header from '../../components/Header';
import { getPhotosFromUser, openCamera, editName, } from '../../store/configuration/congurationAction';
import { changeNetworkEndPoint } from '../../store/aplication/aplicationAction';
import EditName from './EditName';
import EditPhoto from './EditPhoto';
import ViewQR from './ViewQR';
import Languajes from './Language';
import i18n from '../../i18n';
import { database, bitcoin } from '../../../App';
import AddPin from '../LoadWallet/RestoreWithPin';

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
      language: false,
      pin: false,
      forceDialog: false,
      network: false
    };
  }

  close = (name) => {
    this.setState({
      [name]: false
    });
  };

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };


  createBackupFile = async (pin) => {
    database.verifyPin(pin).then(async () => {
      const data = await database.getAllData();
      const ciphertext = await bitcoin.encrypt(JSON.stringify(data), await bitcoin.sha256(pin)).toString();
      let base64 = Buffer.from(ciphertext).toString('base64');
      base64 = `data:text/plain;base64,${base64}`;
      await Share.open({
        url: base64,
        filename: 'Backup'
      }).then(() => {
        this.close('pin');
      }).catch((shareError) => {
        if (shareError.toString() === 'Error: User did not share') {
          this.close('pin');
        }
      });
    }).catch(() => {
      // const error = JSON.parse()
    });
  }

  navigate = () => {
    this.props.navigation.navigate('deviceSettings');
  }

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

        <EditName
          open={this.state.openModalName}
          {...this.props}
          close={this.close}
        />

        <Languajes
          open={this.state.language}
          {...this.props}
          close={this.close}
        />

        <ViewQR {...this.props} open={this.state.viewQR} close={this.close} />

        {!this.state.forceDialog && (
          <AddPin
            {...this.props}
            open={this.state.pin}
            text={screenProps.t('Settings:textBackup')}
            action={this.createBackupFile}
            close={this.close}
            config
          />
        )}

        <View>
          <ScrollView>
            <View style={styles.sectionContainer}>
              <View style={styles.imageContainer}>
                {this.props.config.picture && (
                  <TouchableHighlight
                    testID="pictureDefined"
                    style={styles.touchable}
                    underlayColor="#eeeeee"
                  >
                    <Thumbnail
                      source={{
                        uri: this.props.config.picture,
                        cache: 'force-cache'
                      }}
                      style={styles.imageStyle}
                    />
                  </TouchableHighlight>
                )}

                {!this.props.config.picture && (
                  <TouchableHighlight
                    style={styles.touchable}
                    underlayColor="#eeeeee"
                    onPress={() => {
                      this.setState({ openModalPhoto: true });
                    }}
                  >
                    <Thumbnail source={images.noPhoto.url} style={styles.imageStyle} />
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

            <View style={styles.infoContainer}>
              <Left>
                <Icon
                  style={{ color: '#fbc233' }}
                  type="MaterialIcons"
                  name="person"
                />
              </Left>
              <View
                style={{
                  width: '70%',
                  alignContent: 'flex-start',
                  paddingLeft: 10
                }}
              >
                <Text style={styles.textLabel}>
                  {screenProps.t('Settings:name')}
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
                      color: '#bdbdbd',
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

            <TouchableOpacity onPress={() => this.setState({ viewQR: true })}>

              <View style={styles.infoContainerAddress}>
                <Left>
                  <Icon type="MaterialIcons" style={{ color: '#fbc233' }} name="perm-device-information" />
                </Left>
                <View
                  style={{
                    width: '70%',
                    alignContent: 'flex-start',
                    paddingLeft: 10
                  }}
                >

                  <Text style={styles.textInfo}>
                    Account Info
                  </Text>
                </View>
                <Right
                  style={{
                    top: 5
                  }}
                >
                  <View
                    style={styles.touchable}
                    underlayColor="#eeeeee"
                  >
                    <Icon
                      style={{
                        color: '#bdbdbd',
                        fontSize: 25,
                        paddingVertical: 10,
                        paddingHorizontal: 10
                      }}
                      name="caret-forward"
                    />
                  </View>
                </Right>

              </View>
            </TouchableOpacity>

            <View style={styles.infoContainerAddress}>
              <Left>
                <Icon style={{ color: '#fbc233' }} name="globe" />
              </Left>
              <View
                style={{
                  width: '70%',
                  alignContent: 'flex-start',
                  paddingLeft: 10
                }}
              >
                <Text style={styles.textLabel}>
                  {screenProps.t('Settings:language')}
                </Text>
                <Text style={styles.textInfo}>
                  {' '}
                  {screenProps.t(`Languages:${i18n.language}`)}
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
                      color: '#bdbdbd',
                      fontSize: 25,
                      paddingVertical: 10,
                      paddingHorizontal: 10
                    }}
                    name="caret-forward"
                  />
                </TouchableOpacity>
              </Right>

            </View>
            <TouchableOpacity onPress={() => this.setState({ pin: true })}>
              <View style={styles.infoContainerAddress}>
                <Left>
                  <Icon type="FontAwesome5" style={{ color: '#fbc233' }} name="file-export" />
                </Left>
                <View
                  style={{
                    width: '70%',
                    alignContent: 'flex-start',
                    paddingLeft: 10
                  }}
                >
                  <Text style={styles.textInfo}>
                    {screenProps.t('Settings:createBackup')}
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
                  >
                    <Icon
                      style={{
                        color: '#bdbdbd',
                        fontSize: 25,
                        paddingVertical: 10,
                        paddingHorizontal: 10
                      }}
                      name="caret-forward"
                    />
                  </TouchableOpacity>
                </Right>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navigate()}>
              <View style={styles.infoContainerAddress}>
                <Left>
                  <Icon style={{ color: '#fbc233' }} name="settings" />
                </Left>
                <View
                  style={{
                    width: '70%',
                    alignContent: 'flex-start',
                    paddingLeft: 10
                  }}
                >
                  <Text style={styles.textInfo}>
                    {screenProps.t('Settings:deviceSettings')}
                  </Text>
                </View>
                <Right
                  style={{
                    top: 5
                  }}
                >
                  <Icon
                    style={{
                      color: '#bdbdbd',
                      fontSize: 25,
                      paddingVertical: 10,
                      paddingHorizontal: 10
                    }}
                    name="caret-forward"
                  />
                </Right>

              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
  aplication: state.aplication
});

export default connect(mapStateToProps, {
  getPhotosFromUser,
  openCamera,
  editName,
  changeNetworkEndPoint
})(Config);

const styles = StyleSheet.create({
  qrCodeContainer: {
    alignItems: 'center',
    paddingTop: '5%'
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'row',

    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    marginLeft: 20,
    minHeight: 90,
    marginRight: 20
  },

  infoContainerAddress: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    marginLeft: 20,
    minHeight: 70,
    marginRight: 20
  },

  textLabel: {
    paddingBottom: 3,
    color: '#bdbdbd'
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

  },
  sectionContainer: {
    width: '100%',
    alignItems: 'flex-end'
  },
  imageContainer: {
    width: 220,
    alignItems: 'center',
    paddingVertical: 20
  },
  actionButtonContainer: {
    backgroundColor: '#fbc233',
    height: 45,
    width: 45,
    borderRadius: 100,
    position: 'absolute',
    top: '93%',
    right: '40%',
    borderWidth: 0,
    justifyContent: 'center'
  },

  iconStyles: {
    display: 'flex',
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18
  }
});
