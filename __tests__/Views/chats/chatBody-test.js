import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import Body from '../../../src/views/home/ChatBody';

const close = jest.fn();
const closeView = jest.fn();
const getMoreMessages = jest.fn();
const onClick = jest.fn();
const onSelected = jest.fn();
const sendFileWithImage = jest.fn();
const sendAgain = jest.fn();

const screenProps = {
  t: (data) => data
};

const item = {
  file: {
    fileType: 'image',
    file: 'test'
  },
  fromUID: '16Uiu2HAkyxLaH7HapKCJU4sBwxvjSYN2kEe6Q1fzzsnaSSVrocVG',
  id: '77f51ae45ef28f5505854bcc54bd7b3729b404030c2aec83e9c13a577c1aba8a',
  msg: 'hola',
  name: null,
  shippingTime: 1608234696620,
  status: 'pending',
  timestamp: 1608225235218,
  toUID: 'broadcast',
  type: 1,
  viewed: null,
};


const itemTwo = {
  file: {
    fileType: 'audio',
    file: 'test'
  },
  fromUID: '16Uiu2HAkyxLaH7HapKCJU4sBwxvjSYN2kEe6Q1fzzsnaSSVrocVG',
  id: '77f51ae45ef28f5505854bcc54bd7b3729b404030c2aec83e9c13a577c1aba8a',
  msg: 'hola',
  name: null,
  shippingTime: 1608234696620,
  status: 'pending',
  timestamp: 1608225235218,
  toUID: 'broadcast',
  type: 1,
  viewed: null,
};

const user = {
  image: null,
  imageHash: null,
  ipv6Address: null,
  name: 'kevin',
  peerID: '16Uiu2HAkyxLaH7HapKCJU4sBwxvjSYN2kEe6Q1fzzsnaSSVrocVG',
  picture: null,
  uid: '024349cf9d776fac7147de78b7601e30b264bf12a3ed4d3308d6dbab7569fb18d3'
};

describe('test to the chat body', () => {
  const wrapper = shallow(
    <Body
      chats={[
        item
      ]}
      close={close}
      sendFileWithImage={sendFileWithImage}
      sendAgain={sendAgain}
      closeView={closeView}
      contacts={[]}
      getMoreMessages={getMoreMessages}
      imagesView={[]}
      onClick={onClick}
      selected={[]}
      onSelected={onSelected}
      screenProps={screenProps}
      user={user}
    />
  );

  test('render the component', () => {
    expect(wrapper).toBeDefined();
  });

  test('render item', () => {
    wrapper.instance().renderItem({ item });
  });

  test('audio type message', () => {
    expect(wrapper.instance().renderItem({ item: itemTwo })).toBeDefined();
  });

  test('verifySelected function', () => {
    expect(wrapper.instance().verifySelected(item)).toBe(undefined);
    wrapper.setProps({
      selected: [item]
    });
    expect(wrapper.instance().verifySelected(item)).toBe(undefined);
  });

  test('sendAgain function', () => {
    wrapper.instance().retry();
    expect(sendAgain.mock.calls.length).toBe(1);
  });

  test('onSelected function', () => {
    wrapper.instance().onSelected(item);
    expect(wrapper.instance().state.selected.length).toBe(1);
  });

  test('handleMoreRequest function', () => {
    wrapper.instance().handleMoreRequest();
    expect(getMoreMessages.mock.calls.length).toBe(1);
  });

  test('getKey Function', () => {
    expect(wrapper.instance().getKey(item, 1)).toBe('1');
  });
});
