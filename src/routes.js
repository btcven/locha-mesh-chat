import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from 'react-navigation';
import DualComponent from './index';
import Contact from './views/contacts';
import Config from './views/config';
import Chat from './views/home/Chat';
import Drawer from './components/Drawer';
import DeviceSettings from './views/deviceSettings';
import AdministrativeComponent from './views/config/AdministrativeComponent';

export const AppStackNavigator = createStackNavigator({
  initial: DualComponent,
  contacts: Contact,
  config: Config,
  chat: Chat,
  administrative: AdministrativeComponent,
  deviceSettings: DeviceSettings,
});

const MyDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppStackNavigator
    }
  },
  {
    useNativeAnimations: false,
    contentComponent: Drawer
  }
);

// eslint-disable-next-line no-undef
export default RouteContainer = createAppContainer(MyDrawerNavigator);
