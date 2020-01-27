import React, { Component } from 'react';
import {
  Container,
  ListItem,
  Body,
  Left,
  Button,
  Icon,
  Thumbnail,
} from 'native-base';
import {
  View, Text, StyleSheet, NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import { closeMenu } from '../store/aplication/aplicationAction';
import { images } from '../utils/constans';
import NavigationService from '../utils/navigationService';

/**
 * view of the menu drawer
 * @class HeaderComponent
 * @extends {Component}
 *
 */
class DrawerComponent extends Component {
  handleChange = (view) => {
    NavigationService.navigate(view);
  };

  render() {
    const { screenProps } = this.props;
    return (
      <Container>
        <View style={styles.headerDrawer}>
          <Thumbnail
            style={{ width: '100%', height: '100%' }}
            source={images.logo.url}
          />

          {this.props.user.image && (
            <Thumbnail
              source={{
                uri: `${this.props.user.image}?${new Date().getDate()}`,
                cache: 'force-cache'
              }}
              style={styles.imageStyle}
            />
          )}
          {!this.props.user.image && (
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
        </View>
        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
          <Text>
            { `Version ${NativeModules.RNDeviceInfo.VersionInfo}`}
          </Text>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  menu: state.aplication.menu,
  user: state.config
});

export default connect(mapStateToProps, { closeMenu })(DrawerComponent);

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
