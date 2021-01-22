import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import Chat from '../../../src/views/home/Chat';
import store from '../../../src/store';
import { broadcastInfo } from '../../../src/utils/constans';

const screenProps = {
  t: (data) => data
};


const mockNavigation = {
  state: {
    params: {
      contact: {
        ...broadcastInfo
      },
      chatUID: 'broadcast',
      hashUID: 'test',
      name: 'broadcast'
    }
  }
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

const mockSetView = jest.fn();
const mockDeleteMessages = jest.fn();
const mockStopPlaying = jest.fn();
const mocksendMessageWithFile = jest.fn();
describe('chat container test', () => {
  const wrapper = shallow(
    <Chat
      screenProps={screenProps}
      store={store}
      navigation={mockNavigation}
      chat={mockChat}
    />
  ).childAt(0).dive();

  test('render chat container', () => {
    expect(wrapper.instance()).toBeDefined();
  });

  test('executing componentDidMount without nodeAddress ', () => {
    wrapper.setProps({
      setView: mockSetView
    });
    wrapper.instance().componentDidMount();

    expect(mockSetView.mock.calls.length).toBe(1);
  });


  test('executing componentDidMount with nodeAddress ', () => {
    wrapper.setProps({
      setView: mockSetView
    });
    wrapper.instance().componentDidMount();

    mockNavigation.state.params.contact.noneAddress = 'test';

    wrapper.setProps({
      navigation: mockNavigation,
      setView: mockSetView
    });
    expect(mockSetView.mock.calls.length).toBe(2);
  });


  test('onSelectedFunction', () => {
    wrapper.instance().onSelected(mockMessage[0]);
    expect(wrapper.instance().state.selected.length).toBe(1);
  });


  test('copy function', () => {
    wrapper.instance().copy();
    expect(wrapper.instance().state.selected.length).toBe(0);
  });

  test('function back', () => {
    wrapper.instance().back();
    expect(wrapper.instance().state.selected.length).toBe(0);
  });

  test('delete function', () => {
    wrapper.setProps({
      deleteMessages: mockDeleteMessages
    });
    wrapper.instance().onSelected(mockMessage[0]);
    wrapper.instance().delete();

    expect(mockDeleteMessages.mock.calls.length).toBe(1);
  });

  test('openFileModal function', () => {
    wrapper.setProps({
      stopPlaying: mockStopPlaying,
      forcedPause: false
    });
    wrapper.instance().openFileModal();
    expect(mockStopPlaying.mock.calls.length).toBe(1);
  });

  test('closeFileModal function', () => {
    wrapper.setProps({
      stopPlaying: mockStopPlaying,
      forcedPause: true
    });
    wrapper.instance().closeFileModal();
    expect(mockStopPlaying.mock.calls.length).toBe(2);
  });

  test('closeView function', () => {
    wrapper.instance().closeView();
    expect(wrapper.instance().state.imagesView.length).toBe(0);
  });

  test('setImageView function', () => {
    wrapper.instance().setImageView('test');
    expect(wrapper.instance().state.imagesView.length).toBe(4);
  });


  test('executing componentWillUnmount', () => {
    wrapper.instance().componentWillUnmount('test');
    expect(mockSetView.mock.calls.length).toBe(3);
  });


  test('sendFileWithImage function', async () => {

    wrapper.setProps({
      sendMessageWithFile: mocksendMessageWithFile,
      userData: {
        peerID: 'test'
      }
    });
    await wrapper.instance().sendFileWithImage({
      message: 'test',
      name: 'test',
      url: 'test',
      base64: 'test'
    }, () => {});

    expect(mocksendMessageWithFile.mock.calls.length).toBe(1);
  });
});
