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
      contacts={arrayContact}
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

  test('onSelected function', () => {
    wrapper.instance().onSelect(arrayContact[0]);
    expect(navigationPops.navigate.mock.calls.length).toBe(1);
  });


  test('open add contacts', () => {
    wrapper.instance().openModal();
    expect(wrapper.instance().state.openModal).toBe(true);
  });

  test('close add contacts', () => {
    wrapper.instance().closeModal();
    expect(wrapper.instance().state.openModal).toBe(false);
  });

  test('editContact function', () => {
    wrapper.instance().editContact();
    expect(wrapper.instance().state.openModal).toBe(true);
  });

  test('onLongPress function', () => {
    wrapper.find('Styled(ListItem)').at(0).props().onLongPress();
    expect(wrapper.instance().state.selected.length).toBe(1);
  });

  test('onPress function', () => {
    wrapper.find('Styled(ListItem)').at(0).props().onPress();
  });

  test('onPress function', () => {
    const arrayContact2 = [{
      name: 'test',
      picture: undefined,
      uid: 'test',
      hashUID: 'test'
    }];
    wrapper.instance().setState({
      selected: arrayContact2
    });
    wrapper.find('Styled(ListItem)').at(0).props().onPress();
    expect(wrapper.instance().state.selected.length).toBe(2);
  });

  test('search function', () => {
    wrapper.instance().search('test');
    expect(wrapper.instance().state.search).toBe('test');
  });

  test('close selected function', () => {
    wrapper.instance().closeSelected();
    expect(wrapper.instance().state.selected.length).toBe(0);
  });
});
