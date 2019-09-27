import React, { Component } from "react";
import { Provider } from "react-redux";
import AppComponent from "./src";
import RouteContainer from "./src/routes";
import store from "./src/store";
import { InitialState } from "./src/store/aplication";

export default class App extends Component {
  render() {
    store.dispatch(InitialState());
    return (
      <Provider store={store}>
        <RouteContainer />
      </Provider>
    );
  }
}
