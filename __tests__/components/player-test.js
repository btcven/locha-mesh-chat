import '../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Player from '../../src/components/Player';

describe('spinner component', () => {
  test('Spinner component rendering', () => {
    const rendered = renderer.create(<Player path="http:///test" />).toJSON();
    expect(rendered).toBeTruthy();
  });

  const wrapper = shallow(<Player path="http:///test" />);
  test('execute componentDidMount', async () => {
    await wrapper.instance().componentDidMount();
    expect(wrapper.instance().state.duration).toBe(20);
  });

  describe('test when the player is activated', () => {
    test('play button simulation', () => {
      wrapper.find('TouchableOpacity').at(0).props().onPress();
      expect(wrapper.instance().state.play).toBe(true);
    });

    test('verify that the play button does not appear while the player is running', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'playButton').exists()).toBe(false);
    });

    test('pause button must be rendered when the player is in play', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'playButton').exists()).toBe(false);
    });
  });

  describe('leisurely player', () => {
    test('mock pause button', () => {
      wrapper.find('TouchableOpacity').at(0).props().onPress();
      expect(wrapper.instance().state.play).toBe(false);
    });

    test('play button must be rendered when the player is in pause', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'playButton').exists()).toBe(true);
    });
  });
});
