import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import PinView from '../../../src/views/LoadWallet/PinView';

const mockFuntion = jest.fn();

test('render component phrases', () => {
  const rendered = renderer.create(
    <PinView
      createAccount={mockFuntion}
    />

  ).toJSON();
  expect(rendered).toBeTruthy();
});

describe('test pinView component', () => {
  const wrapper = shallow(<PinView
    createAccount={mockFuntion}
  />);

  test('verify that the pin is sent correctly', () => {
    wrapper.setState({ pin: ['1', '1', '1', '1', '1', '1'] });
    expect(mockFuntion.mock.calls.length).toBe(1);
  });
});
