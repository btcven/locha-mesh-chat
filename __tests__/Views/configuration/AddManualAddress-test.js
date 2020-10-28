import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import AddManualAddress from '../../../src/views/config/AddManualAddress';

const screenProps = {
  t: (data) => data
};


const mockActionData = jest.fn((name, callback) => callback());
const mockCloseFunction = jest.fn();
describe('test Administrative component', () => {
  const wrapper = shallow(
    <AddManualAddress
      screenProps={screenProps}
      action={mockActionData}
      open
      close={mockCloseFunction}
    />
  );

  test('simulate functions saveDials', () => {
    wrapper.find('Styled(Input)').at(0).props().onChangeText('test');

    expect(wrapper.instance().state.name).toBe('test');
  });

  test('simulate button back', () => {
    wrapper.find('Styled(Button)').first().props().onPress();

    expect(mockCloseFunction.mock.calls.length).toBe(1);
  });


  test('simulate button save', () => {
    wrapper.find('Styled(Button)').at(1).props().onPress();

    expect(mockActionData.mock.calls.length).toBe(1);
  });

  test('it will close modal when click outside', () => {
    const data = wrapper.find('ReactNativeModal').dive();

    data.find('TouchableWithoutFeedback').props().onPress();

    expect(mockCloseFunction.mock.calls.length).toBe(2);
  });
});
