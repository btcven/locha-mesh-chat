import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Language from '../../../src/views/config/Language';

const screenProps = {
  t: (data) => data
};


describe('Language component', () => {
  const wrapper = shallow(<Language screenProps={screenProps} open />);
  test('vercheck if the modal is openify epe', () => {
    expect(wrapper.instance().props.open).toBeTruthy();
  });

  test('simulation of closing the modal', () => {
    wrapper.setProps({ open: false });

    expect(wrapper.instance().props.open).not.toBeTruthy();
  });
});
