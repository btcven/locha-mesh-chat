import React, { Component } from "react";
import Footer from "./components/Footer";
import { connect } from "react-redux";
import { route } from "./store/aplication/aplicationAction";
import { StyleSheet, View, Alert } from "react-native";
import Home from "./views/home";
import Contact from "./views/contacts";
import Config from "./views/config";
import InitialStep from "./InitialStep";
import NotifService from "./utils/notificationService";

class DualComponent extends Component {
  constructor(props) {
    super(props);

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this)
    );
  }

  static navigationOptions = {
    header: null
  };

  componentDidUpdate = prevProps => {
    if (this.props.view !== "chat") {
      Object.values(prevProps.chat).map(prevchat => {
        Object.values(this.props.chat).map(chat => {
          const lastPreChat = prevchat.messages[prevchat.messages.length - 1];
          const lastChat = chat.messages[chat.messages.length - 1];
          if (lastChat) {
            if (!lastPreChat || lastPreChat.msgID !== lastChat.msgID) {
              if (this.props.user !== lastChat.fromUID) {
                this.notif.localNotif(lastChat);
              }
            }
          }
        });
      });
    }
  };

  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log("on notify", notif);
    Alert.alert(notif.title, notif.message);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.user && (
          <View style={styles.container}>
            {this.props.tabPosition === 1 && <Home {...this.props} />}
            {this.props.tabPosition === 2 && <Contact {...this.props} />}
            {this.props.tabPosition === 3 && <Config {...this.props} />}
            <Footer />
          </View>
        )}
        <View>{!this.props.user && <InitialStep />}</View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  tabPosition: state.aplication.tab,
  user: state.config.uid,
  chat: state.chats.chat,
  view: state.aplication.view
});

export default connect(
  mapStateToProps,
  { route }
)(DualComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
