import '../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Header from '../../src/components/Header';

describe('header Component', () => {
  test('rendering the header', () => {
    const rendered = renderer.create(<Header />).toJSON();
    expect(rendered).toBeTruthy();
  });
});
