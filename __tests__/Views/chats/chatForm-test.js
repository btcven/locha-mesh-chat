import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import ChatForm from '../../../src/views/home/ChatForm';
import mock from '../../../__Mocks__/dataMock';

const sendChatMock = jest.fn();
const mockOpenModal = jest.fn();
const sendMessageWithSongMock = jest.fn();

const screenProps = {
  t: (data) => data
};

const mockNavigation = {
  state: {
    params: {
      uid: 'broadcast'
    }
  }
};

describe('chat form component', () => {
  const wrapper = shallow(
    <ChatForm
      user={mock.mockUser}
      navigation={mockNavigation.state}
      setChat={sendChatMock}
      previousChat={[]}
      openFileModal={mockOpenModal}
      sendMessagesWithSound={sendMessageWithSongMock}
      screenProps={screenProps}
    />
  );

  test('render all component', () => {
    expect(wrapper.instance()).toBeDefined();
  });

  test('componentDidMount', async () => {
    const instance = wrapper.instance();
    await instance.componentDidMount();
    expect(instance.state.hasPermission).toBe(true);
  });

  test('audio button', () => {
    wrapper.find('Draggable').props().onPressIn();
    wrapper.instance().setState({
      hasPermission: true
    });
    expect(wrapper.instance().state.recording).toBe(true);
  });

  test('audio button', () => {
    wrapper.find('Draggable').props().onPressOut();
    expect(wrapper.instance().state.recording).toBe(false);
  });

  test('simulate onchageText', () => {
    const input = wrapper.find('Component').first();
    input.props().onChangeText('test');

    expect(wrapper.instance().state.message).toBe('test');
  });

  test('send message', async () => {
    await wrapper.find('ForwardRef').at(1).props().onPress();
    setTimeout(async () => {
      await expect(sendChatMock.mock.calls.length).toBe(1);
    }, 1000);
  });


  test('open file modal', () => {
    wrapper.find('ForwardRef').at(0).props().onPress();
    expect(mockOpenModal.mock.calls.length).toBe(1);
  });


  test('send audio function', async () => {
    const mockObject = {
      file: 'test',
      path: 'test'
    };

    wrapper.instance().setState({
      currentTime: 10,
      recording: false
    });
    await wrapper.instance().sendAudio(mockObject);
    setTimeout(async () => {
      await expect(sendMessageWithSongMock.mock.calls.length).toBe(1);
    }, 500);
  });


  test('request permision', async () => {
    wrapper.instance().setState({
      hasPermission: false
    });
    await wrapper.instance().record();
    setTimeout(async () => {
      await expect(wrapper.instance().state.hasPermission).toBe(true);
    }, 500);
  });
});
