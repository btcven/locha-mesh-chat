import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import Mnemonic from 'bitcore-mnemonic';
import Phrases from '../../../src/views/LoadWallet/Phrases';

const mnemonic = new Mnemonic();
const words = mnemonic.toString().split(' ');

test('render component phrases', () => {
  const rendered = renderer.create(
    <Phrases
      values={words}
      setFieldValue={jest.fn()}
    />

  ).toJSON();
  expect(rendered).toBeTruthy();
});
