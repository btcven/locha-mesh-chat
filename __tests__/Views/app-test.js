import '../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { navigationPops } from '../components/heder-test';
import App from '../../App';
import store from '../../src/store';

const screenProps = {
  t: (data) => data
};

test('test app component', () => {
  const wrapper = shallow(
    <App
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  ).childAt(0).dive();

  expect(wrapper).toBeDefined();
});
