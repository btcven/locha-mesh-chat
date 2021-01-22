import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import ImagesView from '../../../src/views/home/imagesView';

const screenProps = {
  t: (data) => data
};

const event = {
  nativeEvent: {
    contentSize: {
      height: 30
    }
  }
};
const sendFileWithImage = jest.fn().mockImplementation((obj, cb) => {
  cb();
});
const close = jest.fn();

describe('imagesView component', () => {
  test('render component', () => {
    const rendered = renderer.create(
      <ImagesView
        sendFileWithImage={sendFileWithImage}
        images={[]}
        open
        close={close}
        screenProps={screenProps}
        navigation={navigationPops}
      />
    ).toJSON();

    expect(rendered).toBeDefined();
  });


  const wrapper = shallow(
    <ImagesView
      sendFileWithImage={sendFileWithImage}
      images={[{
        url: 'test'
      }]}
      open
      close={close}
      screenProps={screenProps}
      navigation={navigationPops}
    />
  );

  test('close imageView', () => {
    const other = wrapper.find('Component');
    other.first().props().onRequestClose();
    expect(close.mock.calls.length).toBe(1);
  });

  test('set text to the input', () => {
    wrapper.find('Component').at(1).props().onChangeText('hola');
    wrapper.find('Component').at(1).props().onContentSizeChange(event);
    expect(wrapper.instance().state.message).toBe('hola');
  });

  test('send image', () => {
    wrapper.find('ForwardRef').props().onPress();
    expect(sendFileWithImage.mock.calls.length).toBe(1);
  });

  test('execute back function', async () => {
    await wrapper.instance().back();
    expect(close.mock.calls.length).toBe(3);
  });
});
