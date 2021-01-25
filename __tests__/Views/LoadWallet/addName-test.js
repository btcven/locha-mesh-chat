import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import AddName from '../../../src/views/LoadWallet/AddName';

const screenProps = {
  t: (data) => data
};

const mockAddName = jest.fn();
describe('render component phrases', () => {
  const wrapper = shallow(
    <AddName
      setName={mockAddName}
      name="test"
      screenProps={screenProps}
    />
  );
  test('render component', () => {
    expect(wrapper.instance()).toBeTruthy();
  });


  test('setName function', () => {
    wrapper.find('Styled(Input)').at(0).props().onChangeText('test');
    expect(mockAddName.mock.calls.length).toBe(1);
  });
});
