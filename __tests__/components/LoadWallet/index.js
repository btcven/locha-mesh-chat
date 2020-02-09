import '../../../__Mocks__';
import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import LoadWallet from '../../../src/views/LoadWallet';
import store from '../../../src/store';

const setUp = () => {
  const wrapper = shallow(<LoadWallet store={store} />);
  return wrapper;
};

describe('load wallet component', () => {
  let wrapper;
  beforEach(() => {
    wrapper = setUp();
  });
});
