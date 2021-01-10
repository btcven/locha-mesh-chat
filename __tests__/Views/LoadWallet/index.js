import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import InitialStep from '../../../src/views/LoadWallet/index';
import store from '../../../src/store';
import { navigationPops } from '../../components/heder-test';

const screenProps = {
  t: (data) => data
};
describe(' testing the main  createWallet', () => {
  const wrapper = shallow(
    <InitialStep
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  ).childAt(0).dive();

  test('simulate create account button ', () => {
    wrapper.find('Styled(Button)').at(1).props().onPress();
    expect(wrapper.find('CreateAccount').exists()).toBeTruthy();
  });

  test('check if gender the words', () => {
    expect(wrapper.instance().state.phrases).toBeTruthy();
  });

  test('close modal create account', () => {
    wrapper.instance().setState({ open: false });
    expect(wrapper.find('CreateAccount').exists()).not.toBeTruthy();
  });

  test('simulate restore  button', () => {
    wrapper.find('Styled(Button)').at(1).props().onPress();
    expect(wrapper.find('CreateAccount').exists()).toBeTruthy();
  });
});
