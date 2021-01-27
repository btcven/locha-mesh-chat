import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import PinView from '../../../src/views/LoadWallet/PinView';

const mockFuntion = jest.fn();

describe('test pinView component', () => {
  const wrapper = shallow(<PinView
    createAccount={mockFuntion}
  />);

  test('verify that the pin is sent correctly', () => {
    wrapper.setState({ pin: ['1', '1', '1', '1', '1', '1'] });
    expect(mockFuntion.mock.calls.length).toBe(1);
  });

  test('set Pin', () => {
    wrapper.find('Styled(Button)').at(0).props().onPress('0');
    wrapper.find('Styled(Button)').at(1).props().onPress('1');
    wrapper.find('Styled(Button)').at(2).props().onPress('2');
    wrapper.find('Styled(Button)').at(3).props().onPress('3');
    wrapper.find('Styled(Button)').at(4).props().onPress('4');
    wrapper.find('Styled(Button)').at(5).props().onPress('5');
    wrapper.find('Styled(Button)').at(6).props().onPress('6');
    wrapper.find('Styled(Button)').at(7).props().onPress('8');
    wrapper.find('Styled(Button)').at(8).props().onPress('9');
    wrapper.find('Styled(Button)').at(9).props().onPress('10');
    wrapper.find('Styled(Button)').at(9).props().onPress('delete');
  });
});
