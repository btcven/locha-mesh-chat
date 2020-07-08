/* eslint-disable import/prefer-default-export */
import '../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Header from '../../src/components/Header';
import store from '../../src/store';

export const navigationPops = {
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
  toggleDrawer: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  dismiss: jest.fn(),
  goBack: jest.fn(),
  navigate: jest.fn(),
  setParams: jest.fn(),
  state: { routeName: 'initial', key: 'id-1581513550398-0' }
};

const seachMockFunction = () => {
  jest.fn();
};

const mockBack = jest.fn();
const deleteMock = jest.fn();

describe('header Component', () => {
  test('rendering the header', () => {
    const rendered = renderer.create(
      <Provider store={store}>
        <Header navigation={navigationPops} />
      </Provider>
    ).toJSON();
    expect(rendered).toBeTruthy();
  });

  describe('testing header without passing the selected parameter', () => {
    const wrapper = shallow(
      <Header store={store} navigation={navigationPops} />
    ).childAt(0).dive();

    test('verify that the view without the selected parameter is rendered', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'selected').exists()).toBe(true);
    });
    test('verify that the icon to open the menu is rendered', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'iconMenu').exists()).toBe(true);
    });

    test('simulate open the menu', () => {
      wrapper.find('ForwardRef').first().props().onPress();
      expect(navigationPops.openDrawer.mock.calls.length).toBe(1);
    });

    test('render the search button', () => {
      wrapper.setProps({ search: true });
      expect(wrapper.find('ForwardRef').at(1).exists()).toBe(true);
      wrapper.setProps({ search: seachMockFunction });
    });

    test('simulate open search', () => {
      wrapper.find('ForwardRef').at(1).props().onPress();
      expect(wrapper.instance().state.search).toBe(true);
    });

    test('simulate close search', () => {
      wrapper.find('Styled(Icon)').at(1).props().onPress();
      expect(wrapper.instance().state.search).toBe(false);
    });
  });

  describe('test the header by passing the selected parameter', () => {
    const wrapper = shallow(
      <Header
        store={store}
        navigation={navigationPops}
        selected={['1', '2']}
        back={mockBack}
        delete={deleteMock}
      />
    ).childAt(0).dive();

    test('verify that the components are rendered correctly after passing the selected parameter', () => {
      expect(wrapper.findWhere((node) => node.prop('testID') === 'selected').exists()).toBe(false);
    });

    test('simulate back button', () => {
      wrapper.find('ForwardRef').first().props().onPress();
      expect(mockBack.mock.calls.length).toBe(1);
    });

    test('simulate back delete', () => {
      wrapper.find('ForwardRef').at(1).props().onPress();
      expect(deleteMock.mock.calls.length).toBe(1);
    });
  });
});
