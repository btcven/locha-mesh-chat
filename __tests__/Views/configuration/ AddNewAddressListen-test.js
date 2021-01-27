import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import AddNewAddressListen from '../../../src/views/config/AddNewAddressListen';
import store from '../../../src/store';

const screenProps = {
  t: (data) => data
};

const mockCloseFunction = jest.fn();

describe('test new Address Listen component', () => {
  const wrapper = shallow(
    <AddNewAddressListen
      screenProps={screenProps}
      open
      store={store}
      close={mockCloseFunction}
    />
  ).childAt(0).dive();


  test('it will close modal when click outside', () => {
    const data = wrapper.find('ReactNativeModal').dive();

    data.find('TouchableWithoutFeedback').props().onPress();

    expect(mockCloseFunction.mock.calls.length).toBe(1);
  });

  test('simulate button back', () => {
    wrapper.find('Styled(Button)').first().props().onPress();

    expect(mockCloseFunction.mock.calls.length).toBe(2);
  });


  it('should check `componentDidMount()`', async () => {
    const instance = wrapper.instance(); // you assign your instance of the wrapper
    await instance.componentDidMount();

    expect(instance.state.isDefaul).toBe(true);
  });

  test('simulate Picker', () => {
    const enable = wrapper.find('Styled(PickerNB)').dive().instance().props.enabled;
    expect(enable).toBe(false);
  });

  test('simulate function for change to address', () => {
    wrapper.instance().setState({ isDefaul: false });
    wrapper.find('Styled(PickerNB)').first().props().onValueChange('192.168.1.1');
    expect(wrapper.instance().state.adressSelected).toBe('192.168.1.1');
  });

  test('simulate checkbox', () => {
    wrapper.find('Styled(CheckBox)').first().props().onPress();

    expect(wrapper.instance().state.isDefaul).toBe(true);

    wrapper.find('Styled(CheckBox)').first().props().onPress();
    expect(wrapper.instance().state.isDefaul).toBe(false);
  });


  test('simulate save button', async () => {
    await wrapper.find('Styled(Button)').at(1).props().onPress();

    expect(mockCloseFunction.mock.calls.length).toBe(2);

    await wrapper.instance().save();
  });
});
