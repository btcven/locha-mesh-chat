import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import ViewQR from '../../../src/views/config/ViewQR';

const screenProps = {
  t: (data) => data
};


const config = {
  name: 'test',
  uid: 'test',
  nodeAddress: ['test']
};

describe('Language component', () => {
  const wrapper = shallow(<ViewQR screenProps={screenProps} open config={config} />);
  test('vercheck if the modal is openify epe', () => {
    expect(wrapper.instance().props.open).toBeTruthy();
  });

  test('simulation of closing the modal', () => {
    wrapper.setProps({ open: false });

    expect(wrapper.instance().props.open).not.toBeTruthy();
  });
});
