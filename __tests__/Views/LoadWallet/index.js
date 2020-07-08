import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import InitialStep from '../../../src/views/LoadWallet/index';
import store from '../../../src/store';
import { navigationPops } from '../../components/heder-test';

const screenProps = {
  t: (data) => data
};
test('render main component to create account', () => {
  const rendered = renderer.create(
    <Provider store={store}>
      <InitialStep screenProps={screenProps} navigation={navigationPops} />
    </Provider>
  ).toJSON();
  expect(rendered).toBeTruthy();
});

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
