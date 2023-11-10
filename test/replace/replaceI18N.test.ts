import { I18N_TAG } from '../../src/models/config.js';
import { I18N } from '../../src/models/i18n.js';
import { replaceI18N } from '../../src/replace.js';

const i18N: I18N = {
  prop1: {
    prop2: 'foobar',
  },
};

describe('replaceI18N', () => {
  test('standard string', () => {
    expect(replaceI18N(i18N, 'xyz')).toEqual('xyz');
  });

  test('i18n key without tag', () => {
    expect(replaceI18N(i18N, 'prop1.prop2')).toEqual('prop1.prop2');
  });

  test('with empty tag', () => {
    expect(replaceI18N(i18N, `${I18N_TAG}()`)).toEqual('');
    expect(replaceI18N(i18N, `${I18N_TAG}( )`)).toEqual('');
  });

  test('unknown i18n key', () => {
    expect(replaceI18N(i18N, `${I18N_TAG}(prop3)`)).toEqual('prop3');
  });

  test('i18n key with tag', () => {
    expect(replaceI18N(i18N, `${I18N_TAG}(prop1.prop2)`)).toEqual('foobar');
  });
});
