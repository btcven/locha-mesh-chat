import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import Home from '../../../src/views/home';
import store from '../../../src/store';


const screenProps = {
  t: (data) => data
};

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

const mockChat = [{
  fromUID: '02ce1eeb78647383eac7998e929aa72240cc3d908f682f0375738330ab128bdea7',
  messages: { ...mockMessage },
  queue: [],
  toUID: 'broadcast'
}];


const mockContact = [{
  hashUID: '1ed4091506f77825bccb4dadcf89f1b62ff3257d2afc3886bf859c0330120a27',
  name: 'Luis',
  nodeAddress: '/ip4/85.53.137.144/tcp/4444',
  picture: null,
  uid: '16Uiu2HAm2BXA1TTUE7vvSu3U4YURxb4FwTYjfrwnZN618jrYBpNS'
}];

describe('test home componente', () => {
  const wrapper = shallow(
    <Home
      store={store}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  ).childAt(0).dive();


  test('render home component', () => {
    expect(wrapper).toMatchSnapshot();
  });


  test('set props contacts', () => {
    wrapper.setProps({
      contacts: mockContact
    });
    expect(wrapper.instance().props.contacts).toBeDefined();
  });

  test('set props chat', () => {
    wrapper.setProps({
      chats: mockChat
    });
    expect(wrapper.instance().props.chats).toBeDefined();
  });


  test('selectedChat function', () => {
    wrapper.instance().selectedChat(mockContact[0], mockChat[0]);
    expect(navigationPops.navigate.mock.calls.length).toBe(1);
  });
});
