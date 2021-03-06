import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import Messages from '../../../src/views/home/Messages';

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
  idHash: 'ad7ae2f9dc672c55095e60f2e8367393261088972af35c49c007be0c642fda24',
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

const mockMessage2 = [{
  fromUID: '16Uiu2HAm9JHK1iG6g2nLNw2fmAWerGiVoKMnjcvEs6pJVnd6STPC',
  id: 'ad7ae2f9dc672c55095e60f2e8367393261088972af35c49c007be0c642fda24',
  msg: 'Hola',
  msgID: 'ad7ae2f9dc672c55095e60f2e8367393261088972af35c49c007be0c642fda24',
  name: undefined,
  shippingTime: 1602013395803,
  status: 'pending',
  time: 1602013395803,
  timestamp: 1602013395786,
  idHash: 'ad7ae2f9dc672c55095e60f2e8367393261088972af35c49c007be0c642fda24',
  toUID: '16Uiu2HAm2BXA1TTUE7vvSu3U4YURxb4FwTYjfrwnZN618jrYBpNS',
  type: 1
}];

const onLongPressMock = jest.fn();
const onPressMock = jest.fn();

describe('message component', () => {
  const wrapper = shallow(
    <Messages
      screenProps={screenProps}
      item={mockMessage[0]}
      contactInfo={mockContact}
      onClick={onPressMock}
      userInfo={mockContact[0]}
      onSelected={onLongPressMock}
      view="receive"
    />
  );

  const wrapper2 = shallow(
    <Messages
      screenProps={screenProps}
      item={mockMessage[0]}
      contactInfo={mockContact}
      onClick={onPressMock}
      onSelected={onLongPressMock}
      view="sender"
    />
  );


  test('render SenderMessage', () => {
    expect(wrapper2).toBeDefined();
  });


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

  test('receive  message when the contact is defined', () => {
    const wrapper3 = shallow(
      <Messages
        screenProps={screenProps}
        item={mockMessage2[0]}
        contactInfo={mockContact}
        onClick={onPressMock}
        onSelected={onLongPressMock}
        view="receive"
      />
    );
    expect(wrapper3).toBeDefined();
  });


  test('onLongPress button message in sender', () => {
    wrapper2.find('ForwardRef').at(0).props().onLongPress();
    expect(onLongPressMock.mock.calls.length).toBe(2);
  });

  test('onPress button message in sender', () => {
    wrapper2.find('ForwardRef').at(0).props().onPress();
    expect(onLongPressMock.mock.calls.length).toBe(2);
  });
});
