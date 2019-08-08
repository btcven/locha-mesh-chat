import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Footer, FooterTab, Button, Text, Icon } from "native-base";
import { NavigationActions, NavigationDispatch } from "react-navigation";
import { connect } from "react-redux";
import NavigationService from "../utils/navigationService";

class FooterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1
    };
  }

  hangleChage = (tab, active) => {
    this.setState({
      active: active
    });
    NavigationService.navigate(tab);
  };

  render() {
    const { active } = this.state;
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab style={styles.footerTab}>
          <Button
            vertical
            style={styles.bottonActive}
            onPress={() => this.hangleChage("initial", 1)}
            active={active === 1 ? true : false}
          >
            <Icon
              type="MaterialIcons"
              style={active === 1 ? styles.textTabColor2 : styles.textTabColor1}
              name="chat"
            />
            <Text
              style={active === 1 ? styles.textTabColor2 : styles.textTabColor1}
            >
              Apps
            </Text>
          </Button>
          <Button
            vertical
            style={styles.bottonActive}
            onPress={() => this.hangleChage("contacts", 2)}
            active={active === 2 ? true : false}
          >
            <Icon
              type="MaterialIcons"
              style={active === 2 ? styles.textTabColor2 : styles.textTabColor1}
              name="person"
            />
            <Text
              style={active === 2 ? styles.textTabColor2 : styles.textTabColor1}
            >
              Contactos
            </Text>
          </Button>
          <Button
            onPress={() => this.hangleChage("config", 3)}
            active={active === 3 ? true : false}
            style={styles.bottonActive}
          >
            <Icon
              type="MaterialIcons"
              style={active === 3 ? styles.textTabColor2 : styles.textTabColor1}
              name="settings"
            />
            <Text
              style={active === 3 ? styles.textTabColor2 : styles.textTabColor1}
            >
              Configuracion
            </Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const mapStateToProps = state => ({
  stateP: state
});

export default connect(
  mapStateToProps,
  null
)(FooterComponent);

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#bdbdbd"
  },

  footerTab: {
    backgroundColor: "#fff",
    color: "red"
  },

  bottonActive: {
    display: "flex",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderLeftWidth: 1,
    borderTopColor: "#bdbdbd",
    borderLeftColor: "#bdbdbd"
  },
  textTabColor1: {
    color: "black"
  },
  textTabColor2: {
    color: "#26a69a"
  }
});
