import React, { Component } from "react";
import Footer from "./components/Footer";
import { connect } from "react-redux";
import { route } from "./store/aplication/aplicationAction";
import { StyleSheet, View, Alert, Text, AppState } from "react-native";
import Home from "./views/home";
import Contact from "./views/contacts";
import Config from "./views/config";
import LoadWallet from "./views/LoadWallet";
import RestoreWithPing from './views/LoadWallet/RestoreWithPin'
import Spinner from "./components/Spinner";
import { clearAll } from "./store/aplication";
import { selectedChat } from "./store/chats";
import { AsyncStorage } from "react-native";
import i18n from "./i18n/index";
import moment from 'moment'


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

  componentDidMount = async () => {
    AppState.addEventListener("change", this.verifyState)
    const lng = await AsyncStorage.getItem("@APP:languageCode");
    if (lng) {
      i18n.changeLanguage(lng);
    }
  };

  render() {
    const open = !this.props.user && this.props.status ? true : false

    return (
      <View style={styles.container}>
        {this.props.loading && <Spinner />}
        {this.props.user && (
          <View style={styles.container}>
            {this.props.tabPosition === 1 && <Home {...this.props} />}
            {this.props.tabPosition === 2 && (
              <Contact navigation={this.props.navigation} />
            )}
            {this.props.tabPosition === 3 && <Config {...this.props} />}
          </View>
        )}
        <View>
          {!this.props.user && (
            <LoadWallet screenProps={this.props.screenProps} />
          )}

          <RestoreWithPing open={open} screenProps={this.props.screenProps} />

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
