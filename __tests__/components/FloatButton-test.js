import '../../__Mocks__';
import { Text } from 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FloatButton from '../../src/components/FloatButton';
// import store from '../../../src/store';


it('renders without crashing', () => {
  const rendered = renderer.create(<FloatButton />).toJSON();
  expect(rendered).toBeTruthy();
});

describe('load wallet component', () => {
  test('text rendering without icon', () => {
    const element = shallow(<FloatButton
      add={jest.fn()}
    />);
    expect(element.findWhere((node) => node.prop('testID') === 'addIcon').exists()).toBe(true);
  });

  test('icon rendering', () => {
    const element = shallow(<FloatButton
      add={jest.fn()}
      icon={(
        <Text>
          hello
        </Text>
      )}
    />);
    expect(element.findWhere((node) => node.prop('testID') === 'addIcon').exists()).toBe(false);
  });


  test('simulating button click', () => {
    const mockFunction = jest.fn();
    const element = shallow(<FloatButton add={mockFunction} />);
    element.find('ForwardRef').first().props().onPress();
    expect(mockFunction.mock.calls.length).toBe(1);
  });
});
