import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import DeviceSettings from '../../../src/views/deviceSettings';
import store from '../../../src/store';


const screenProps = {
  t: (data) => data
};

test('render the main component', () => {
  const rendered = shallow(
    <DeviceSettings
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  );
  expect(rendered).toBeTruthy();
});

describe('tests to the main component of device settings', () => {
  const wrapper = shallow(
    <DeviceSettings
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  ).childAt(0).dive();

  // test('render spiner component', () => {
  //   expect(wrapper.find('Auth').exists()).toBeTruthy();
  // });

  test('render error component', () => {
    wrapper.setProps({
      deviceInfo: {
        status: 'error'
      }
    });

    expect(wrapper.find('ErrorInfo').exists()).toBeTruthy();
  });

  test('render device panel component', () => {
    wrapper.setProps({
      deviceInfo: {
        status: 'connected'
      }
    });

    expect(wrapper.find('settingsPanel').exists()).toBeTruthy();
  });
});
