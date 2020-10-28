import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import ViewQR from '../../../src/views/config/ViewQR';

const screenProps = {
  t: (data) => data
};

const mockCloseFunction = jest.fn();

const config = {
  name: 'test',
  uid: 'test',
  nodeAddress: ['test']
};

describe('Language component', () => {
  const wrapper = shallow(<ViewQR screenProps={screenProps} open config={config} close={mockCloseFunction} />);
  test('vercheck if the modal is openify epe', () => {
    expect(wrapper.instance().props.open).toBeTruthy();
  });

  test('simulation of closing the modal', () => {
    wrapper.setProps({ open: false });

    expect(wrapper.instance().props.open).not.toBeTruthy();
  });

  test('simulate PeerId copy button', () => {
    wrapper.find('ForwardRef').first().props().onPress();
  });

  test('onValueChange test', () => {
    wrapper.instance().onValueChange('test');
    expect(wrapper.instance().state.address).toBe('test');
  });

  test('it will close modal when click outside', () => {
    const data = wrapper.find('ReactNativeModal').dive();

    data.find('TouchableWithoutFeedback').props().onPress();

    expect(mockCloseFunction.mock.calls.length).toBe(1);
  });
});
