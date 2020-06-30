/* eslint-disable no-underscore-dangle */
import '../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import Menu from '../../src/components/Menu';

const item = [
  {
    label: 'Test',
    action: jest.fn()
  }
];

describe('testing the functionality of the menu component', () => {
  const wrapper = shallow(<Menu menu={item} />);
  test('verify that the menu is closed when rendering', () => {
    expect(wrapper.instance()._menu).toBe(false);
  });
});
