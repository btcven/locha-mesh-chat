import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import Language from '../../../src/views/config/Language';

const screenProps = {
  t: (data) => data
};

const mockClose = jest.fn();


describe('Language component', () => {
  const wrapper = shallow(<Language
    screenProps={screenProps}
    open
    close={mockClose}
  />);
  test('vercheck if the modal is openify epe', () => {
    expect(wrapper.instance().props.open).toBeTruthy();
  });

  test('simulation of closing the modal', () => {
    wrapper.setProps({ open: false });

    expect(wrapper.instance().props.open).not.toBeTruthy();
  });

  test('close modal button', () => {
    wrapper.find('ReactNativeModal').at(0).props().onBackdropPress();
    expect(mockClose.mock.calls.length).toBe(1);
  });

  test('onChangeLang function', async () => {
    await wrapper.find('Styled(Radio)').at(0).props().onPress('es');
    expect(mockClose.mock.calls.length).toBe(2);
  });
});
