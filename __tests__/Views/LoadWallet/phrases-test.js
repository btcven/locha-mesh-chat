import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import Phrases from '../../../src/views/LoadWallet/Phrases';

const words = 'cactus spatial damp canvas coach income wool doll mail radio senior mixed'.split(' ');

test('render component phrases', () => {
  const rendered = renderer.create(
    <Phrases
      values={words}
      setFieldValue={jest.fn()}
    />

  ).toJSON();
  expect(rendered).toBeTruthy();
});
