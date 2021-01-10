import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import RestoreWithPin from '../../../src/views/LoadWallet/RestoreWithPin';
import store from '../../../src/store';

const screenProps = {
  t: (data) => data
};

const createBackupFile = jest.fn();
const close = jest.fn();

describe('restore With pin component', () => {
  const wrapper = shallow(<RestoreWithPin
    open
    text="test"
    store={store}
    action={createBackupFile}
    close={close}
    screenProps={screenProps}
    config
  />).childAt(0).dive();

  test('render component', () => {
    expect(wrapper.instance()).toBeDefined();
  });

  test('render component without config', () => {
    const wrapper2 = shallow(<RestoreWithPin
      open
      text="test"
      store={store}
      action={createBackupFile}
      close={close}
      screenProps={screenProps}
    />).childAt(0).dive().dive();

    expect(wrapper2.instance()).toBeDefined();
  });
});
