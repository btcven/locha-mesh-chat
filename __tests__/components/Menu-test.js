/* eslint-disable no-underscore-dangle */
import '../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Menu from '../../src/components/Menu';

const item = [
  {
    label: 'Test',
    action: jest.fn()
  }
];

it('Menu component rendering', () => {
  const rendered = renderer.create(<Menu menu={item} />).toJSON();
  expect(rendered).toBeTruthy();
});


describe('testing the functionality of the menu component', () => {
  const wrapper = shallow(<Menu menu={item} />);
  test('verify that the menu is closed when rendering', () => {
    expect(wrapper.instance()._menu).toBe(false);
  });

  test('show default icon', () => {
    console.log(wrapper.find('Menu').props().onPress());
  });
});
