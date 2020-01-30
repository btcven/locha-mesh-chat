import '../__Mocks__';
import { sha256 } from 'js-sha256';
import { generateName, hashGenerateColort, getIcon } from '../src/utils/utils';

describe('reusable functions of utils.js', () => {
  test('function of generating name', () => {
    const name = generateName();
    expect(typeof (name)).toBe('string');
  });

  describe('generate hexadecimal color', () => {
    test('return string color', () => {
      expect(typeof hashGenerateColort('hello')).toBe('string');
    });

    test('execute function without any parameters', () => {
      expect(() => { hashGenerateColort(); }).toThrow();
    });

    test('generate the same color if you miss the same estring', () => {
      expect(hashGenerateColort('color')).toBe('#632fa7');
    });
  });


  describe('generate icon with a string', () => {
    const hash = sha256('hash');
    test('generate icon', () => {
      const icon = getIcon(hash);
      expect(getIcon(hash)).toBe(icon);
    });

    test('execute function without any parameters', () => {
      expect(() => { getIcon(); }).toThrow();
    });

    test('pass numerical data', () => {
      expect(() => { getIcon(1234567789123456789012345); }).toThrow();
    });

    test('send less than 15 characters', () => {
      expect(() => { getIcon('h1wdk24qsl123'); }).toThrow();
    });
  });
});
