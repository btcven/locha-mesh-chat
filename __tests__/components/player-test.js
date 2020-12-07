import '../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Player from '../../src/components/Player ';
import store from '../../src/store';

describe('spinner component', () => {
  test('Spinner component rendering', () => {
    const rendered = renderer.create(<Player store={store} path="http:///test" />).toJSON();
    expect(rendered).toBeTruthy();
  });

  const wrapper = shallow(<Player store={store} path="http:///test" />).childAt(0).dive();
  test('execute componentWillUnmount', async () => {
    wrapper.instance().componentWillUnmount();
  });

  test('execute componentDidMount', async () => {
    wrapper.instance().componentDidMount();

    expect(wrapper.instance().state.keyPlayer).toBe('test');
  });

  describe('test when the player is activated', () => {
    test('play button simulation', () => {
      wrapper.find('ForwardRef').at(0).props().onPress();
      expect(wrapper.instance().state.play).toBe(true);
    });

    test('verify that the play button does not appear while the player is running', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'playButton').exists()).toBe(false);
    });

    test('pause button must be rendered when the player is in play', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'playButton').exists()).toBe(false);
    });
  });

  test('execute initial componentDidUpdate', async () => {
    wrapper.setState({
      play: true,
      pause: true
    });
    await wrapper.instance().componentDidUpdate({ path: 'test2' }, null, null);
    expect(wrapper.instance().state.keyPlayer).toBe('test');
  });

  test('execute getDuration', () => {
    wrapper.instance().getDuration();
    expect(wrapper.instance().interval).toBeDefined();
    // clearInterval(wrapper.instance().interval);
  });

  test('pause function', async () => {
    await wrapper.instance().pause();
    expect(wrapper.instance().state.pause).toBe(true);
  });


  test('execute onSliderEditing', () => {
    wrapper.instance().setState({
      duration: 20
    });
    wrapper.instance().onSliderEditing(10);

    expect(wrapper.instance().state.reproduced).toBe(10);
  });


  describe('leisurely player', () => {
    test('mock pause button', () => {
      wrapper.instance().setState({
        play: false
      });
      wrapper.find('ForwardRef').at(0).props().onPress();
      expect(wrapper.instance().state.play).toBe(true);
    });

    test('play button must be rendered when the player is in pause', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'pauseButton').exists()).toBe(true);
    });
  });
});
