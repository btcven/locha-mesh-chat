import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import moment from 'moment';
import { route } from './store/aplication/aplicationAction';
import Home from './views/home';
import LoadWallet from './views/LoadWallet';
import RestoreWithPing from './views/LoadWallet/RestoreWithPin';
import { clearAll } from './store/aplication';
import { selectedChat } from './store/chats';
import WifiConnect from './WifiConnect';
import UdpServer from './utils/udp';
// import locale from "react-native-locale-detector";

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
      appState: 'active',
      timeBackgroud: null
    };
  }

  componentDidMount = () => {
    new UdpServer();
  }

  verifyState = (nextAppState) => {
    this.setState({
      appState: nextAppState
    });
  }

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  componentDidUpdate = () => {
    if (this.state.appState === 'background' && !this.state.timeBackgroud) {
      this.setState({ timeBackgroud: new Date().getTime() });
    }
    if (this.state.appState !== 'background' && this.state.timeBackgroud) {
      const timeCreated = moment(this.state.timeBackgroud);
      if (moment().diff(timeCreated, 'm' > 14)) {
        this.props.clearAll();
        this.setState({ timeBackgroud: null });
      } else {
        this.setState({ timeBackgroud: null });
      }
    }
  }

  // getDefaultLanguage = async () => {
  //   const savedDataJSON = await AsyncStorage.getItem('@APP:languageCode');
  //   const lng = savedDataJSON || locale;
  //   return lng;
  // };

  render() {
    const open = !!(!this.props.user && this.props.status);
    return (
      <View style={styles.container}>
        <WifiConnect open={this.props.notConnectedValidAp} />
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


const mapStateToProps = (state) => ({
  tabPosition: state.aplication.tab,
  user: state.config.uid,
  chat: state.chats.chat,
  loading: state.aplication.loading,
  view: state.aplication.view,
  status: state.aplication.appStatus,
  retryConnection: state.aplication.retryConnection,
  notConnectedValidAp: state.aplication.notConnectedValidAp
});

export default connect(mapStateToProps, { route, selectedChat, clearAll })(DualComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});
