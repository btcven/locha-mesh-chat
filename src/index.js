import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { route } from './store/aplication/aplicationAction';
import Home from './views/home';
import LoadWallet from './views/LoadWallet';
import RestoreWithPing from './views/LoadWallet/RestoreWithPin';
import { selectedChat } from './store/chats';
import './utils/ErrorHandler';
/**
 *
 * @description application views container
 * @class DualComponent
 * @extends {Component}
 */
class DualComponent extends Component {
  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  render() {
    const open = !!(!this.props.user && this.props.status);
    return (
      <View style={styles.container}>
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

export default connect(mapStateToProps, { route, selectedChat })(DualComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});
