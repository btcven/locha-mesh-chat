import '../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import Spinner from '../../src/components/Spinner';


describe('spinner component', () => {
  it('Spinner component rendering', () => {
    const rendered = renderer.create(<Spinner />).toJSON();
    expect(rendered).toBeTruthy();
  });
});
