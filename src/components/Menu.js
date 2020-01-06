import React, { Component } from "react";
import { Text, View } from "react-native";
import { Button, Icon } from "native-base";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

/**
 * @export
 * @class MenuComponent
 * @extends {Component}
 * @description Reusable component is a menu that works as a select
 *
 *
 */

export default class MenuComponent extends Component {
  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  
  render() {
    return (
      <View>
        <Menu
          ref={this.setMenuRef}
          button={
            <Button onPress={this.showMenu} transparent>
              {!this.props.item && <Icon name="more" />}
              {this.props.item && this.props.item}
            </Button>
          }
        >
          {this.props.menu.map((menu, key) => {
            return (
              <MenuItem
                key={key}
                onPress={() => {
                  menu.action(this.hideMenu)
                }}
              >
                {menu.label}
              </MenuItem>
            );
          })}
        </Menu>
      </View>
    );
  }
}
