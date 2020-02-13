import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Language from '../../../src/views/config/Language';

const screenProps = {
  t: (data) => data
};

test('render the component', () => {
  const rendered = renderer.create(
    <Language screenProps={screenProps} />
  ).toJSON();
  expect(rendered).toBeTruthy();
});

describe('Language component', () => {
  const wrapper = shallow(<Language screenProps={screenProps} open={true} />);
  test('vercheck if the modal is openify epe', () => {

    expect(wrapper.instance().props.open).toBeTruthy();
  });

  test('simulation of closing the modal', () => {
    wrapper.setProps({ open: false });

    expect(wrapper.instance().props.open).not.toBeTruthy();
  });
});
