/* eslint-disable import/no-named-as-default-member */
import '../__Mocks__';

import MockData from '../__Mocks__/dataMock';
import {
  hashGenerateColort, getIcon, unSelect
} from '../src/utils/utils';
import { bitcoin } from '../App';

describe('generate hexadecimal color', () => {
  test('return string color', () => {
    expect(typeof hashGenerateColort('hello')).toBe('string');
  });


  test('generate the same color if you miss the same estring', () => {
    expect(hashGenerateColort('color')).toBe('#632fa7');
  });
});


describe('generate icon with a string', () => {
  test('generate icon', () => {
    const icon = getIcon('hash');

    expect(getIcon('hash')).toBe(icon);
  });
});

describe('function to select chat and contacts', () => {
  test('verify that the contact is not selected', () => {
    expect(
      unSelect([], MockData.mockContact1)
    ).toEqual({
      found: false,
    });
  });

  test('remove selected array contact', () => {
    expect(
      unSelect([MockData.mockContact1], MockData.mockContact1)
    ).toEqual({
      found: true,
      data: []
    });
  });
  test('contact of many selected', () => {
    expect(
      unSelect([MockData.mockContact1, MockData.mockContact2], MockData.mockContact1)
    ).toEqual({
      found: true,
      data: [MockData.mockContact2]
    });
  });

  test('check with the wrong parameter', () => {
    expect(() => unSelect(MockData.mockContact2, MockData.mockContact1)).toThrow();
  });
});
