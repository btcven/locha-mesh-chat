import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { translate } from 'react-i18next';
import { Root } from 'native-base';
import RouteContainer from './src/routes';
import store from './src/store';
import { verifyAplicationState } from './src/store/aplication';
import NativationService from './src/utils/navigationService';
import Bitcoin from './src/utils/Bitcoin';
import Database from './src/database';
import { NativeModules } from 'react-native'

console.warn("ipv6", NativeModules.RNDeviceInfo.localIpv6);

const WrappedStack = ({ t }) => (
  <RouteContainer
    ref={(ref) => {
      NativationService.setTopLevelNavigator(ref);
    }}
    screenProps={{ t }}
  />
);
const ReloadAppOnLanguageChange = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedStack);

export const database = new Database();
export const bitcoin = new Bitcoin();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    store.dispatch(verifyAplicationState());
    // store.dispatch(loading());
    return (
      <Provider store={store}>
        <Root>
          <ReloadAppOnLanguageChange />
        </Root>
      </Provider>
    );
  }
}
