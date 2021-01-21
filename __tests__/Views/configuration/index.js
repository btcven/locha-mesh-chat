import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import Configuration from '../../../src/views/config';
import store from '../../../src/store';

const screenProps = {
  t: (data) => data
};

describe('main component of configurations', () => {
  describe('testing the main configuration functions', () => {
    const wrapper = shallow(
      <Configuration
        store={store}
        screenProps={screenProps}
        navigation={navigationPops}
      />
    ).childAt(0).dive();


    test('open modal photo', () => {
      wrapper.find('ForwardRef').first().props().onPress();
      expect(wrapper.instance().state.openModalPhoto).toBe(true);
      wrapper.instance().setState({ openModalPhoto: false });
    });

    test('open modal name', () => {
      wrapper.find('ForwardRef').at(2).props().onPress();
      expect(wrapper.instance().state.openModalName).toBe(true);
    });

    test('open modal Qr Information', () => {
      wrapper.find('ForwardRef').at(3).props().onPress();
      expect(wrapper.instance().state.viewQR).toBe(true);
    });

    test('open modal pin', () => {
      wrapper.find('ForwardRef').at(5).props().onPress();
      expect(wrapper.instance().state.pin).toBe(true);
    });


    test('navigate function', () => {
      wrapper.instance().navigate();
      expect(navigationPops.navigate.mock.calls.length).toBe(1);
    });

    test('picture defined', () => {
      wrapper.setProps({
        config: {
          picture: 'test',
          name: 'name'
        }
      });
      expect(wrapper.findWhere((node) => node.prop('testID') === 'pictureDefined').exists()).toBe(true);
    });

    test('closed function', () => {
      wrapper.setState({ network: true })
      wrapper.instance().close('network');
      expect(wrapper.instance().state.network).toBe(false);
    });
  });
});
