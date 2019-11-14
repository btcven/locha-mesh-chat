import React, { Component } from "react";
import Footer from "./components/Footer";
import { connect } from "react-redux";
import { route } from "./store/aplication/aplicationAction";
import { StyleSheet, View, Alert } from "react-native";
import Home from "./views/home";
import Contact from "./views/contacts";
import Config from "./views/config";
import InitialStep from "./InitialStep";
import Spinner from "./components/Spinner";
import NotifService from "./utils/notificationService";
import { selectedChat } from "./store/chats";
import { realmObservable } from "./database/realmDatabase";

/**
 *
 * @description application views container
 * @class DualComponent
 * @extends {Component}
 */
class DualComponent extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = () => {
    realmObservable();
  };

  render() {
    return (
      <View style={styles.container}>
        {/* {this.props.loading && <Spinner />} */}
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
            <InitialStep screenProps={this.props.screenProps} />
          )}
        </View>
      </View>
    );
  }
}

export let notify = {};

const mapStateToProps = state => ({
  tabPosition: state.aplication.tab,
  user: state.config.uid,
  chat: state.chats.chat,
  loading: state.aplication.loading,
  view: state.aplication.view
});

export default connect(mapStateToProps, { route, selectedChat })(DualComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
