import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { ReceiveMessage } from '../../../src/views/home/Messages';

const mockMessage = [{
  fromUID: '16Uiu2HAm9JHK1iG6g2nLNw2fmAWerGiVoKMnjcvEs6pJVnd6STPC',
  id: 'ad7ae2f9dc672c55095e60f2e8367393261088972af35c49c007be0c642fda24',
  msg: 'Hola',
  msgID: 'ad7ae2f9dc672c55095e60f2e8367393261088972af35c49c007be0c642fda24',
  name: undefined,
  shippingTime: 1602013395803,
  status: 'pending',
  time: 1602013395803,
  timestamp: 1602013395786,
  toUID: 'broadcast',
  type: 1
}];

const screenProps = {
  t: (data) => data
};

const mockContact = [{
  hashUID: '1ed4091506f77825bccb4dadcf89f1b62ff3257d2afc3886bf859c0330120a27',
  name: 'Luis',
  nodeAddress: '/ip4/85.53.137.144/tcp/4444',
  picture: null,
  uid: '16Uiu2HAm2BXA1TTUE7vvSu3U4YURxb4FwTYjfrwnZN618jrYBpNS'
}];

const onLongPressMock = jest.fn();
const onPressMock = jest.fn();

describe('message component', () => {
  const wrapper = shallow(
    <ReceiveMessage
      screenProps={screenProps}
      item={mockMessage}
      contactInfo={mockContact}
      onClick={onPressMock}
      onSelected={onLongPressMock}

    />
  );

  test('render all component', () => {
    expect(wrapper.instance()).toBeDefined();
  });

  test('onLongPress button message', () => {
    wrapper.find('ForwardRef').at(0).props().onLongPress();
    expect(onLongPressMock.mock.calls.length).toBe(1);
  });

  test('onPress button message', () => {
    wrapper.find('ForwardRef').at(0).props().onPress();
    expect(onPressMock.mock.calls.length).toBe(1);
  });
});
