import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import EditName from '../../../src/views/config/EditName';


const screenProps = {
  t: (data) => data
};
const mockEditName = jest.fn().mockImplementation((obj, cb) => {
  cb();
});
const mockClose = jest.fn();

describe('Edit naame component', () => {
  describe('Functions editName component', () => {
    const wrapper = shallow(<EditName
      screenProps={screenProps}
      close={mockClose}
      editName={mockEditName}
      config={{
        uid: 'test'
      }}
    />);

    test('verify that the button is disabled', () => {
      expect(wrapper.find('Styled(Button)').at(1).props().disabled).toBeTruthy();
    });


    test('send data to the input', () => {
      wrapper.instance().setState({ name: 'test' });
      expect(wrapper.find('Styled(Input)').first().props().value).toBeTruthy();
    });

    test('verify that the button is disabled', () => {
      expect(wrapper.find('Styled(Button)').at(1).props().disabled).not.toBeTruthy();
    });

    test('close modal button', () => {
      wrapper.find('ReactNativeModal').at(0).props().onBackdropPress();
      expect(mockClose.mock.calls.length).toBe(1);
    });

    test('change name function', () => {
      wrapper.find('Styled(Button)').at(1).props().onPress();
      expect(mockEditName.mock.calls.length).toBe(1);
    });

    test('back button', () => {
      wrapper.find('Styled(Button)').at(0).props().onPress();
      expect(mockClose.mock.calls.length).toBe(3);
    });
  });
});
