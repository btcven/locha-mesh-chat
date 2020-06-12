import React, { Component } from 'react';
import {
  Header, Left, Body, Right, Title, Icon, Thumbnail
} from 'native-base';
import {
  StyleSheet, TouchableHighlight, TextInput, View, Text, TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { sha256 } from 'js-sha256';
import Menu from './Menu';
import { getIcon } from '../utils/utils';
import { openMenu, manualConnection } from '../store/aplication';

/**
 *
 * @class HeaderComponent
 * @extends {Component}
 * @description reusable component is the application header
 */
class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      searchBarFocused: false
    };
  }

  /**
   *get the current route
   * @function
   * @memberof HeaderComponent
   * @returns {object}
   */
  getNameContact = (navigation) => {
    if (navigation) {
      return navigation.state;
    }
    return undefined;
  };

  back = () => {
    this.props.navigation.pop();
  };

  onChange = () => {
    this.setState({ search: !this.state.search });
    this.props.search(undefined);
  };

  render() {
    const { screenProps, retryConnection, navigation } = this.props;
    const router = this.getNameContact(navigation);
    const selected = this.props.selected
      ? this.props.selected.length < 1
      : true;
    if (selected) {
      return (
        <>
          <Header
            testID="selected"
            style={styles.container}
            androidStatusBarColor={this.props.modal ? 'white' : '#af7d00'}
          >
            {this.props.navigation
              && this.props.navigation.state.routeName !== 'initial'
              && !this.state.search && (
                <Left>
                  <TouchableHighlight
                    underlayColor="#eeeeee"
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 100
                    }}
                    onPress={() => this.back()}
                  >
                    <Icon style={styles.iconStyle} name="arrow-back" />
                  </TouchableHighlight>
                </Left>
            )}
            {router.routeName === 'initial' && (
              <Left>
                <TouchableHighlight
                  testID="iconMenu"
                  underlayColor="#eeeeee"
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 100
                  }}
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}
                >
                  <Icon style={styles.iconStyle} name="menu" />
                </TouchableHighlight>
              </Left>
            )}
            {!this.state.search && (
              <Body>
                {router.routeName === 'initial' && (
                  <Title style={{ color: '#fff' }}>Locha Mesh</Title>
                )}

                {this.props.name
                  && <Title style={{ color: '#fff' }}>{this.props.name}</Title>}

                {router.routeName === 'contacts' && (
                  <Title style={{ color: '#fff' }}>
                    {screenProps.t('Header:contacts')}
                  </Title>
                )}

                {router.routeName === 'config' && (
                  <Title style={{ color: '#fff' }}>
                    {screenProps.t('Header:settings')}
                  </Title>
                )}

                {router.routeName === 'chat' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {router.params && !router.params.picture && (
                      <Thumbnail
                        style={{ marginRight: 10, width: 45, height: 40 }}
                        source={{
                          uri: `${getIcon(sha256(router.params.uid))}`
                        }}
                      />
                    )}

                    {router.params && router.params.picture && (
                      <Thumbnail
                        style={{ marginRight: 10, width: 45, height: 40 }}
                        source={{
                          uri: `${router.params.picture}`
                        }}
                      />
                    )}
                    <Title>
                      {router.params ? router.params.name : 'broadcast'}
                    </Title>
                  </View>
                )}
              </Body>
            )}
            <Right>
              {this.props.menu && <Menu menu={this.props.menu} />}
              {!this.state.search && this.props.search && (
                <TouchableHighlight
                  underlayColor="#eeeeee"
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 100
                  }}
                  onPress={() => this.onChange()}
                >
                  <Icon name="search" style={{ fontSize: 24, color: 'white' }} />
                </TouchableHighlight>
              )}
            </Right>

            {this.state.search && (
              <Animatable.View
                animation="slideInRight"
                duration={500}
                style={styles.search}
              >
                <Animatable.View
                  animation={
                    this.state.searchBarFocused ? 'fadeInLeft' : 'fadeInRight'
                  }
                  duration={400}
                >
                  <Icon
                    type="MaterialIcons"
                    name="arrow-back"
                    style={{ fontSize: 24 }}
                    onPress={() => this.onChange()}
                  />
                </Animatable.View>
                <TextInput
                  placeholder="Search"
                  style={{
                    fontSize: 17,
                    marginTop: 5,
                    marginLeft: 10,
                    width: 100
                  }}
                  onChangeText={(text) => this.props.search(text)}
                />
              </Animatable.View>
            )}
          </Header>
          {retryConnection === 4
            && (
              <View style={styles.notConnectedContainer}>
                <Text>not connected</Text>
                <TouchableOpacity onPress={this.props.manualConnection}>
                  <Text style={{ textDecorationLine: 'underline' }}>RETRY</Text>
                </TouchableOpacity>
              </View>
            )}
        </>
      );
    }
    return (
      <Header
        style={styles.container}
        androidStatusBarColor={this.props.modal ? 'white' : '#af7d00'}
      >
        <Left>
          <TouchableHighlight
            onPress={this.props.back}
            underlayColor="#eeeeee"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 100
            }}
          >
            <Icon name="arrow-back" style={styles.iconStyle} />
          </TouchableHighlight>
        </Left>
        <Body>
          {this.props.selected.length === 1 ? (
            <Title>{this.props.selected[0].name}</Title>
          ) : (
            <Title>{this.props.selected.length}</Title>
          )}
        </Body>
        <Right>
          {this.props.copy && (
            <TouchableHighlight
              underlayColor="#eeeeee"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 100
              }}
              onPress={this.props.copy}
            >
              <Icon
                style={styles.iconStyle}
                type="FontAwesome5"
                name="copy"
              />
            </TouchableHighlight>
          )}
          {
            <TouchableHighlight
              underlayColor="#eeeeee"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 100
              }}
              onPress={this.props.delete}
            >
              <Icon style={styles.iconStyle} name="trash" />
            </TouchableHighlight>
          }

          {this.props.selected.length === 1 && this.props.edit && (
            <TouchableHighlight
              underlayColor="#eeeeee"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 100
              }}
              onPress={this.props.edit}
            >
              <Icon style={styles.iconStyle} name="create" />
            </TouchableHighlight>
          )}
        </Right>

      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  aplication: state.aplication,
  other: state.nav
});

export default connect(mapStateToProps, { openMenu, manualConnection })(HeaderComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FAB300'
  },
  search: {
    height: 45,
    backgroundColor: 'white',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5
  },

  iconStyle: {
    fontSize: 24,
    color: 'white'
  },

  notConnectedContainer: {
    backgroundColor: 'red',
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10
  }
});
