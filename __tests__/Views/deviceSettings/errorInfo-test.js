import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import ErrorInfo from '../../../src/views/deviceSettings/errorInfo';

const screenProps = {
  t: (data) => data
};

it('Spinner component rendering', () => {
  const rendered = renderer.create(<ErrorInfo screenProps={screenProps} />).toJSON();
  expect(rendered).toBeTruthy();
});
