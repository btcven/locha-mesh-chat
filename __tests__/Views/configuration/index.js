import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { navigationPops } from '../../components/heder-test';
import Configuration from '../../../src/views/config';
import store from '../../../src/store';

const screenProps = {
  t: (data) => data
};

describe('main component of configurations', () => {
  test('render the main component', () => {
    const rendered = renderer.create(
      <Provider store={store}>
        <Configuration screenProps={screenProps} navigation={navigationPops} />
      </Provider>
    ).toJSON();
    expect(rendered).toBeTruthy();
  });

  describe('testing the main configuration functions', () => {
    const wrapper = shallow(
      <Configuration
        store={store}
        screenProps={screenProps}
        navigation={navigationPops}
      />
    ).childAt(0).dive();

    test('open modal photo', () => {
      wrapper.find('TouchableHighlight').first().props().onPress();
      expect(wrapper.instance().state.openModalPhoto).toBe(true);
      wrapper.instance().setState({ openModalPhoto: false });
    });

    test('open modal name', () => {
      wrapper.find('TouchableHighlight').at(1).props().onPress();
      expect(wrapper.instance().state.openModalName).toBe(true);
    });

    test('open modal Qr Information', () => {
      wrapper.find('TouchableHighlight').at(2).props().onPress();
      expect(wrapper.instance().state.viewQR).toBe(true);
    });

    test('open modal language', () => {
      wrapper.find('TouchableOpacity').at(2).props().onPress();
      expect(wrapper.instance().state.language).toBe(true);
    });

    test('open modal pin', () => {
      wrapper.find('TouchableOpacity').at(3).props().onPress();
      expect(wrapper.instance().state.pin).toBe(true);
    });
  });
});
