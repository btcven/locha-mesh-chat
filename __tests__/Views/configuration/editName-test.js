import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import EditName from '../../../src/views/config/EditName';


const screenProps = {
  t: (data) => data
};

describe('Edit naame component', () => {
  describe('Functions editName component', () => {
    const wrapper = shallow(<EditName screenProps={screenProps} />);

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
  });
});
