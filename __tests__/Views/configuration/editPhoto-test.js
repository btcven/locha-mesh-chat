import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import EditPhoto from '../../../src/views/config/EditPhoto';


const screenProps = {
  t: (data) => data
};

const mockClose = jest.fn();
const mockGetPhotosFromUser = jest.fn().mockImplementation((obj, cb) => {
  cb();
});
const mockOpenCamera = jest.fn().mockImplementation((obj, cb) => {
  cb();
});

describe('EditPhoto Component', () => {
  const wrapper = shallow(
    <EditPhoto
      open
      close={mockClose}
      getPhotosFromUser={mockGetPhotosFromUser}
      screenProps={screenProps}
      openCamera={mockOpenCamera}
      config={{
        uid: 'test'
      }}
    />
  );


  test('render component', () => {
    expect(wrapper.instance()).toBeDefined();
  });

  test('getPhotosFromGallery function', () => {
    wrapper.find('ForwardRef').at(0).props().onPress();
    expect(mockGetPhotosFromUser.mock.calls.length).toBe(1);
  });

  test('getPhotosFromGallery function', () => {

    wrapper.find('ForwardRef').at(1).props().onPress();
    expect(mockOpenCamera.mock.calls.length).toBe(1);
  });


  test('close modal button', () => {
    wrapper.find('ReactNativeModal').at(0).props().onBackdropPress();
    expect(mockClose.mock.calls.length).toBe(3);
  });


});
