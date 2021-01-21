import React, { Component } from 'react';
import {
  Container,
  ListItem,
  Body,
  Left,
  Button,
  Icon,
  Thumbnail,
  BackAndroid
} from 'native-base';
import {
  View, Text, StyleSheet, NativeModules, Alert
} from 'react-native';
import { connect } from 'react-redux';
import { closeMenu, openAdministrativePanel, isAdministrative } from '../store/aplication/aplicationAction';
import { images } from '../utils/constans';
import { toast } from '../utils/utils';

/**
 * view of the menu drawer
 * @class HeaderComponent
 * @extends {Component}
 *
 */
class DrawerComponent extends Component {
  constructor() {
    super();
    this.state = {
      clicks: 0,
    };
  }

  componentDidMount = () => {
    this.props.isAdministrative();
  };


  handleChange = (view) => {
    const { navigation } = this.props;
    navigation.navigate(view);
  };

  onclickCounter = () => {
    const count = this.state.clicks + 1;
    this.setState({
      clicks: count
    });

    if (this.state.clicks === 8) {
      this.props.openAdministrativePanel(() => {
        toast('great! you are now an administrator');
      });
    }
  }

  render() {
    const { screenProps, navigation } = this.props;
    return (
      <Container>
        <View style={styles.headerDrawer}>
          <Thumbnail
            style={{ width: '100%', height: '100%' }}
            source={images.logo.url}
          />

          {this.props.user.picture && (
            <Thumbnail
              source={{
                uri: `${this.props.user.picture}?${new Date().getDate()}`,
                cache: 'force-cache'
              }}
              style={styles.imageStyle}
            />
          )}
          {!this.props.user.picture && (
            <Thumbnail source={images.noPhoto.url} style={styles.imageStyle} />
          )}
          <Text style={styles.textTitle}>{this.props.user.name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ListItem itemDivider>
            <Text>Locha Mesh</Text>
          </ListItem>
          <ListItem icon button onPress={() => this.handleChange('contacts')}>
            <Left>
              <Button style={{ backgroundColor: '#ef6c00' }}>
                <Icon active name="person" />
              </Button>
            </Left>
            <Body>
              <Text>{screenProps.t('Drawer:contacts')}</Text>
            </Body>
          </ListItem>

          <ListItem icon button onPress={() => this.handleChange('config')}>
            <Left>
              <Button style={{ backgroundColor: '#ef6c00' }}>
                <Icon active name="settings" />
              </Button>
            </Left>
            <Body>
              <Text>{screenProps.t('Drawer:setting')}</Text>
            </Body>
          </ListItem>

          {this.props.administrative
            && (
              <>
                <ListItem itemDivider>
                  <Text>{screenProps.t('Drawer:listName')}</Text>
                </ListItem>

                <ListItem icon button onPress={() => this.handleChange('administrative')}>
                  <Left>
                    <Button style={{ backgroundColor: '#ef6c00' }}>
                      <Icon type="MaterialIcons" active name="developer-mode" />
                    </Button>
                  </Left>
                  <Body>
                    <Text>Admin settings</Text>
                  </Body>
                </ListItem>
              </>
            )}
        </View>

        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onPress={this.onclickCounter}
            disabled={this.props.administrative}
            transparent
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>
              {`${screenProps.t('Drawer:version')} ${NativeModules.RNDeviceInfo.VersionInfo}`}
            </Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  menu: state.aplication.menu,
  user: state.config,
  administrative: state.aplication.administrative,

});

export default connect(
  mapStateToProps,
  {
    closeMenu,
    isAdministrative,
    openAdministrativePanel
  }
)(DrawerComponent);

const styles = StyleSheet.create({
  headerDrawer: {
    height: '22%',
    backgroundColor: '#FAB300',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: 60,
    width: 60,
    // borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'red',
    right: '10%',
    top: '20%'
  },
  textTitle: {
    position: 'absolute',
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    bottom: '15%',
    left: 15
  }
});
