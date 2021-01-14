import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { translate } from 'react-i18next';
import { LogBox, YellowBox } from 'react-native';
import { Root } from 'native-base';
import RouteContainer from './src/routes';
import store from './src/store';
import { verifyAplicationState } from './src/store/aplication';
import Bitcoin from './src/utils/Bitcoin';
import Database from './src/database';
import ChatService from './src/utils/chatService';
import NotifService from './src/utils/notificationService';
import AudioModule from './src/utils/AudioModule';
import NativationService from './src/utils/navigationService';

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
export const chatService = new ChatService();
export const notification = new NotifService();
export const audioRecorder = new AudioModule();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {

  render() {
    store.dispatch(verifyAplicationState());
    return (
      <Provider store={store}>
        <Root>
          <ReloadAppOnLanguageChange />
        </Root>
      </Provider>
    );
  }
}
