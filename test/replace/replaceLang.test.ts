import { LANG_TAG } from '../../src/models/config.js';
import { replaceLang } from '../../src/replace.js';

describe('replaceLang', () => {
  test('standard string', () => {
    expect(replaceLang('abc', 'xyz')).toEqual('xyz');
  });

  test('with empty tag', () => {
    expect(replaceLang('abc', `${LANG_TAG}()`)).toEqual('abc');
    expect(replaceLang('abc', `${LANG_TAG}( )`)).toEqual('abc');
  });

  test('with not empty tag', () => {
    expect(replaceLang('abc', `${LANG_TAG}(dummy)`)).toEqual('abc');
  });
});
