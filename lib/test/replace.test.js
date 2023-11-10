import { replaceI18N } from '../src/replace.js';
describe('replaceI18N', () => {
    const i18N = {
        prop1: {
            prop2: 'foobar',
        },
    };
    test('', () => {
        expect(replaceI18N(i18N, 'xyz')).toEqual('xyz');
        expect(replaceI18N(i18N, 'prop1.prop2')).toEqual('prop1.prop2');
    });
});
//# sourceMappingURL=replace.test.js.map