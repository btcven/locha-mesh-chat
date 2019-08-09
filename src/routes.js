import { createStackNavigator, createAppContainer } from "react-navigation";
import DualComponent from "./index";
import Contact from "./views/contacts";
import Config from "./views/config";
import Gallery from "./components/Gallery";

export const AppStackNavigator = createStackNavigator({
  initial: DualComponent,
  contacts: Contact,
  config: Config,
  gallery: Gallery
});

export default (RouteContainer = createAppContainer(AppStackNavigator));
