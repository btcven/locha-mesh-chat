import { createStackNavigator, createAppContainer } from "react-navigation";
import index from "./views/home";
import Contact from "./views/contacts";
import Config from "./views/config";


export const AppStackNavigator = createStackNavigator({
  initial: index,
  contacts: Contact,
  config: Config,
});

export default (RouteContainer = createAppContainer(AppStackNavigator));
