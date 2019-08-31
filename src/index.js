import React, { Component } from "react";
import Footer from "./components/Footer";
import { connect } from "react-redux";
import { route } from "./store/aplication/aplicationAction";
import { StyleSheet, View } from "react-native";
import Home from "./views/home";
import Contact from "./views/contacts";
import Config from "./views/config";
import InitialStep from "./InitialStep";

class DualComponent extends Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    header: null
  };

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
  user: state.config.uid
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
