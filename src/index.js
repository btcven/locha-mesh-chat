import React, { Component } from "react";
import { connect } from "react-redux";
import { route } from "./store/aplication/aplicationAction";
import { StyleSheet, View, Alert, Text, AppState, Share } from "react-native";
import Home from "./views/home";
import LoadWallet from "./views/LoadWallet";
import RestoreWithPing from './views/LoadWallet/RestoreWithPin'
import Spinner from "./components/Spinner";
import { clearAll } from "./store/aplication";
import { selectedChat } from "./store/chats";
import { AsyncStorage } from "react-native";
import i18n from "./i18n/index";
import moment from 'moment'
import locale from "react-native-locale-detector";

/**
 *
 * @description application views container
 * @class DualComponent
 * @extends {Component}
 */
class DualComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: "active",
      timeBackgroud: null
    }
  }

  static navigationOptions = {
    header: null
  };

  verifyState = (nextAppState) => {
    this.setState({
      appState: nextAppState
    })
  }

  componentDidUpdate = () => {
    if (this.state.appState === "background" && !this.state.timeBackgroud) {
      this.setState({ timeBackgroud: new Date().getTime() })
    }
    if (this.state.appState !== "background" && this.state.timeBackgroud) {
      const timeCreated = moment(this.state.timeBackgroud);
      if (moment().diff(timeCreated, "m" > 14)) {
        this.props.clearAll()
        this.setState({ timeBackgroud: null })
      } else {
        this.setState({ timeBackgroud: null })
      }
    }

  }

  getDefaultLanguage = async () => {
    const savedDataJSON = await AsyncStorage.getItem("@APP:languageCode");
    const lng = savedDataJSON ? savedDataJSON : locale;
    return lng;
  };

  componentDidMount = async () => {
    // const lng = await this.getDefaultLanguage()
    // if (lng) {
    //   i18n.changeLanguage(lng.substr(0, 2));
    // }
  };

  render() {
    const open = !this.props.user && this.props.status ? true : false

    return (
      <View style={styles.container}>
        {this.props.loading && <Spinner />}
        {this.props.user && (
          <View style={styles.container}>
            {this.props.tabPosition === 1 && <Home {...this.props} />}
          </View>
        )}
        <View>
          {!this.props.user && (
            <LoadWallet screenProps={this.props.screenProps} />
          )}

          <RestoreWithPing
            open={open}
            screenProps={this.props.screenProps}
          />
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  tabPosition: state.aplication.tab,
  user: state.config.uid,
  chat: state.chats.chat,
  loading: state.aplication.loading,
  view: state.aplication.view,
  status: state.aplication.appStatus
});

export default connect(mapStateToProps, { route, selectedChat, clearAll })(DualComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
