import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { navigationPops } from '../../components/heder-test';
import Contacts from '../../../src/views/contacts';
import store from '../../../src/store';

const screenProps = {
  t: (data) => data
};

const arrayContact = [{
  name: 'test',
  picture: undefined,
  uid: '5c28fab375d47994b30190b01338ea48daa0b307909a3d465a597772469633e1weq',
  hashUID: '02e5f8f594f8ca7e27d0f0b3e37430bcad4c066f4bbd92b0be9c052a36ba5bc1d6'
}];

test('render the main component', () => {
  const rendered = renderer.create(
    <Provider store={store}>
      <Contacts screenProps={screenProps} navigation={navigationPops} />
    </Provider>
  ).toJSON();
  expect(rendered).toBeTruthy();
});


describe('tests to the main component of contacts', () => {
  const wrapper = shallow(
    <Contacts
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  ).childAt(0).dive();

  test('the contact list should not be displayed if contacts arrive empty', () => {
    expect(wrapper.find('Styled(List)').exists()).not.toBeTruthy();
  });

  test('contact list must be visible', () => {
    wrapper.setProps({ contacts: arrayContact });
    expect(wrapper.find('Styled(List)').exists()).toBeTruthy();
  });

  test('', () => {
    const fbWrapper = wrapper.find('FloatButtons').dive();
    fbWrapper.find('ForwardRef').first().props().onPress();
    expect(wrapper.find('AddContact').exists()).toBeTruthy();
  });
});
