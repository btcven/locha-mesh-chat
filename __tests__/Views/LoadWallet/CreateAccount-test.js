import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import CreateAccount from '../../../src/views/LoadWallet/CreateAccount';
import store from '../../../src/store';
import { navigationPops } from '../../components/heder-test';

const screenProps = {
  t: (data) => data
};

const words = 'cactus spatial damp canvas coach income wool doll mail radio senior mixed'.split(' ');
const stringWords = 'cactus spatial damp canvas coach income wool doll mail radio senior mixed';
const back = jest.fn();

describe('test component createAccount', () => {
  const initial = shallow(
    <CreateAccount
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
      phrases={words}
      stringPhrases={stringWords}
      close={back}
    />
  );
  const wrapper = initial.dive();

  describe('test component in step 1', () => {
    test('render title', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'TextCreateAccount').exists()).toBeTruthy();
    });

    test('verify that incorrect information is not displayed in the view', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'TextConfirmWords').exists()).not.toBeTruthy();

      expect(wrapper.findWhere((node) => node.prop('testID') === 'TextPin').exists()).not.toBeTruthy();

      expect(wrapper.findWhere((node) => node.prop('testID') === 'TextUserName').exists()).not.toBeTruthy();

      expect(wrapper.findWhere((node) => node.prop('testID') === 'TextRestoreAccount').exists()).not.toBeTruthy();

      expect(wrapper.findWhere((node) => node.prop('testID') === 'ButtonRestore').exists()).not.toBeTruthy();
    });

    test('verify that the correct buttons are displayed', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'buttonBack').exists()).toBeTruthy();

      expect(wrapper.findWhere((node) => node.prop('testID') === 'buttonContinue').exists()).toBeTruthy();
    });


    test('simute button back', () => {
      wrapper.find('Styled(Button)').first().props().onPress();
      expect(back.mock.calls.length).toBe(1);
    });
  });

  describe('test component in step 2', () => {
    test('simulate continue button', () => {
      wrapper.find('Styled(Button)').at(1).props().onPress();
      expect(initial.instance().state.step).toBe(2);
      wrapper.update();
    });

    test('render title', () => {
      const confirmWrapper = initial.dive();
      expect(confirmWrapper.findWhere((node) => node.prop('testID') === 'TextConfirmWords').exists()).toBeTruthy();
    });


    test('verify that incorrect information is not displayed in the view', () => {
      const confirmWrapper = initial.dive();
      expect(confirmWrapper.findWhere((node) => node.prop('testID') === 'TextCreateAccount').exists()).not.toBeTruthy();

      expect(confirmWrapper.findWhere((node) => node.prop('testID') === 'TextPin').exists()).not.toBeTruthy();

      expect(confirmWrapper.findWhere((node) => node.prop('testID') === 'TextUserName').exists()).not.toBeTruthy();

      expect(confirmWrapper.findWhere((node) => node.prop('testID') === 'TextRestoreAccount').exists()).not.toBeTruthy();

      expect(confirmWrapper.findWhere((node) => node.prop('testID') === 'ButtonRestore').exists()).not.toBeTruthy();
    });

    test('simulate comfirm', async () => {
      const confirmWrapper = initial.dive();
      words.forEach(async (item, key) => {
        await confirmWrapper.instance().setFieldValue(`${key}`, `${item}`);
      });
      await confirmWrapper.find('Styled(Button)').at(1).props().onPress();
    });

    test('verify that there changed the step', () => {
      expect(initial.instance().state.step).toBe(3);
    });
  });

  describe('test restore acount', () => {
    test('render view restore account', () => {
      initial.instance().setState({ step: 4 });
      expect(initial.instance().state.step).toBe(4);
    });

    test('render title', () => {
      const restoreWrapper = initial.dive();
      expect(restoreWrapper.findWhere((node) => node.prop('testID') === 'TextRestoreAccount').exists()).toBeTruthy();
    });

    test('verify that incorrect information is not displayed in the view', () => {
      const restoreWrapper = initial.dive();
      expect(restoreWrapper.findWhere((node) => node.prop('testID') === 'TextCreateAccount').exists()).not.toBeTruthy();

      expect(restoreWrapper.findWhere((node) => node.prop('testID') === 'TextPin').exists()).not.toBeTruthy();

      expect(restoreWrapper.findWhere((node) => node.prop('testID') === 'TextUserName').exists()).not.toBeTruthy();

      expect(restoreWrapper.findWhere((node) => node.prop('testID') === 'TextConfirmWords').exists()).not.toBeTruthy();
    });

    test('restore button must be rendered', () => {
      const restoreWrapper = initial.dive();
      expect(restoreWrapper.findWhere((node) => node.prop('testID') === 'ButtonRestore').exists()).toBeTruthy();
    });
  });
});
