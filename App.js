import React, { Component } from "react";
import { Provider } from "react-redux";
import RouteContainer from "./src/routes";
import store from "./src/store";
import { InitialState } from "./src/store/aplication";
import NativationService from "./src/utils/navigationService";
import { translate } from "react-i18next";
import i18n from "./src/i18n/index";
import Bitcoin from "./src/utils/Bitcoin";

const WrappedStack = ({ t }) => {
  return (
    <RouteContainer
      ref={ref => {
        NativationService.setTopLevelNavigator(ref);
      }}
      screenProps={{ t }}
    />
  );
};
const ReloadAppOnLanguageChange = translate("common", {
  bindI18n: "languageChanged",
  bindStore: false
})(WrappedStack);

export const bitcoin = new Bitcoin();

export default class App extends Component {
  render() {
    store.dispatch(InitialState());
    return (
      <Provider store={store}>
        <ReloadAppOnLanguageChange />
      </Provider>
    );
  }
}
