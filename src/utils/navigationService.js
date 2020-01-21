import { NavigationActions } from 'react-navigation';

/**
 * service to redirect out of react-navigation.
 * @module navigationService
 */

// eslint-disable-next-line no-underscore-dangle
let _navigator;

/**
 *
 * @description assign the react-nativation props to a local variable
 * @param {object} navigatorRef
 */

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

/**
 *
 * @description function used to redirect
 * @param {string} routeName route name
 * @param {object | null} params parameters passed through the route
 */

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator
};
