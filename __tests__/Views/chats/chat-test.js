import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import Chat from '../../../src/views/home/Chat';
import store from '../../../src/store';


describe('chat container test', () => {

  const wrapper = shallow(
    <Chat store={store} />

  );

  test('render chat container', () => {
    expect(wrapper.instance()).toBeDefined();
  });
})