import React, { Component } from "react";
import RouteContainer from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavigationService from './utils/navigationService'
import { StyleSheet, View } from "react-native";

export default class DualComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <RouteContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
