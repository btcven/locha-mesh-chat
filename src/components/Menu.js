/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'native-base';
import Menu, { MenuItem } from 'react-native-material-menu';

/**
 * @export
 * @class MenuComponent
 * @extends {Component}
 * @description Reusable component is a menu that works as a select
 *
 *
 */

export default class MenuComponent extends Component {
  constructor(props) {
    super(props);
    this._menu = false;
  }

  setMenuRef = (ref) => {
    // eslint-disable-next-line no-underscore-dangle
    this._menu = ref;
  };

  hideMenu = () => {
    // eslint-disable-next-line no-underscore-dangle
    this._menu.hide();
  };

  showMenu = () => {
    // eslint-disable-next-line no-underscore-dangle
    this._menu.show();
  };

  render() {
    return (
      <View>
        <Menu
          ref={this.setMenuRef}
          button={(
            <Button onPress={this.showMenu} transparent>
              {!this.props.item && <Icon testID="defaulIcon" name="ellipsis-vertical" />}
              {this.props.item && this.props.item}
            </Button>
          )}
        >
          {this.props.menu.map((menu) => (
            <MenuItem
              key={menu}
              onPress={() => {
                menu.action(this.hideMenu);
              }}
            >
              {menu.label}
            </MenuItem>
          ))}
        </Menu>
      </View>
    );
  }
}
