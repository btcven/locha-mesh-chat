import '../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Drawer from '../../src/components/Drawer';
import store from '../../src/store';

const screenProps = {
  t: (data) => data
};

const navigationPops = {
  navigate: jest.fn(),
};

describe('test all of functions to the drawer component', () => {
  const wrapper = shallow(
    <Drawer
      screenProps={screenProps}
      store={store}
      navigation={navigationPops}
    />
  ).childAt(0).dive();


  test('test button contact', () => {
    wrapper.find('Styled(ListItem)').at(1).props().onPress();
    expect(navigationPops.navigate.mock.calls[0][0]).toBe('contacts');
  });

  test('test button config', () => {
    wrapper.find('Styled(ListItem)').at(2).props().onPress();
    expect(navigationPops.navigate.mock.calls[1][0]).toBe('config');
  });


  test('test button config', () => {
    for (let index = 0; index < 8; index++) {
      wrapper.find('Styled(Button)').at(2).props().onPress();
    }
    expect(wrapper.instance().state.clicks).toBe(8);
  });
});
