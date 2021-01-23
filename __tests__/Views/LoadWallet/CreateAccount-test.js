import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import CreateAccount from '../../../src/views/LoadWallet/CreateAccount';
import store from '../../../src/store';
import { navigationPops } from '../../components/heder-test';

const screenProps = {
  t: (data) => data
};

const words = 'cactus spatial damp canvas coach income wool doll mail radio senior mixed'.split(' ');
const stringWords = 'cactus spatial damp canvas coach income wool doll mail radio senior mixed';
const back = jest.fn();

const mockCreateAccount = jest.fn().mockImplementation((obj, cb) => {
  cb();
});
const restoreWithPhraseMock = jest.fn();

const MockrestoreWithFile = jest.fn();
describe('test component createAccount', () => {
  const initial = shallow(
    <CreateAccount
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
      phrases={words}
      stringPhrases={stringWords}
      createNewAccount={mockCreateAccount}
      restoreWithFile={MockrestoreWithFile}
      restoreWithPhrase={restoreWithPhraseMock}
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


    test('executed componentWillUnmount ', () => {
      initial.instance().componentWillUnmount();
      expect(initial.instance().state.file).toBe(null);
    });

    test('setName function', () => {
      initial.instance().setName('test');
      expect(initial.instance().state.name).toBe('test');
    });

    test('getFile function', async () => {
      await initial.instance().getFile();
      expect(initial.instance().state.file).toBe('test');
    });

    test('continue function', () => {
      initial.setProps({
        restore: true
      });
      initial.setState({
        step: 4
      });
      initial.instance().continue(words);
      expect(initial.instance().state.step).toBe(3);
      initial.setState({
        step: 3
      });
      initial.instance().continue(words);
      expect(initial.instance().state.step).toBe(5);


      initial.setState({
        step: 4
      });
      words[1] = '';
      initial.instance().continue(words);
      expect(initial.instance().state.step).toBe(4);
    });

    test('createAccount function', () => {
      initial.instance().createAccount('123456', () => { });
      expect(mockCreateAccount.mock.calls.length).toBe(1);
    });

    test('closePin function', async () => {
      initial.instance().closePin();
      expect(initial.instance().state.file).toBe(null);
      initial.setState({
        file: 'test'
      });
      await initial.instance().restoreAccountWithFile('123456');
    });

    test('restoreAccountWithFile function', async () => {
      await initial.instance().copyPhrases();
      expect(MockrestoreWithFile.mock.calls.length).toBe(1);
    });

    test('close modal button', () => {
      wrapper.find('ReactNativeModal').at(0).props().onBackdropPress();
      expect(back.mock.calls.length).toBe(3);
    });

    test('back funtion', () => {
      initial.setState({
        step: 5
      });
      initial.instance().back();
      expect(initial.instance().state.step).toBe(4);
    });

    test('back funtion', () => {
      initial.instance().restoreAccount('12345', words);
      expect(restoreWithPhraseMock.mock.calls.length).toBe(1);
    });
  });
});
