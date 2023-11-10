import lodash from 'lodash';
import { Config, URL_PAGE_TAG } from '../../src/models/config.js';
import { replacePageUrl } from '../../src/replace.js';

describe('replacePageUrl', () => {
  const baseConfig: Config = {
    serve: {
      port: 0,
    },
    i18n: {
      inputLangsDir: '',
      availableLanguages: ['la', 'lb'],
      defaultLang: 'la',
      invisibleDefaultLang: true,
    },
    pages: {
      outputPagesFolderName: '',
      inputPagesDir: '',
      defaultPage: 'index',
      invisibleDefaultPage: true,
    },
    assets: {
      outputAssetsFolderName: '',
      inputAssetsDir: '',
      outputAssetsDir: '',
    },
    additionals: {
      folders: [],
      files: [],
    },
    output: {
      rootOutputDir: '',
    },
  };

  test('standard string', () => {
    expect(replacePageUrl(baseConfig, 'la', 'xyz')).toEqual('xyz');
  });

  test('with empty tag', () => {
    const config: Config = lodash.merge({}, baseConfig);
    config.i18n.invisibleDefaultLang = false;
    config.pages.invisibleDefaultPage = false;
    expect(replacePageUrl(baseConfig, 'la', `${URL_PAGE_TAG}()`)).toEqual('/');
    expect(replacePageUrl(baseConfig, 'la', `${URL_PAGE_TAG}( )`)).toEqual('/');
  });

  test('replacePageUrl visible default lang, visible default page', () => {
    const config: Config = lodash.merge({}, baseConfig);
    config.i18n.invisibleDefaultLang = false;
    config.pages.invisibleDefaultPage = false;
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(index)`)).toEqual('/la/index');
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(dummy)`)).toEqual('/la/dummy');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(index)`)).toEqual('/lb/index');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(dummy)`)).toEqual('/lb/dummy');
  });

  test('replacePageUrl invisible default lang, visible default page', () => {
    const config: Config = lodash.merge({}, baseConfig);
    config.i18n.invisibleDefaultLang = true;
    config.pages.invisibleDefaultPage = false;
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(index)`)).toEqual('/index');
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(dummy)`)).toEqual('/dummy');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(index)`)).toEqual('/lb/index');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(dummy)`)).toEqual('/lb/dummy');
  });

  test('replacePageUrl visible default lang, invisible default page', () => {
    const config: Config = lodash.merge({}, baseConfig);
    config.i18n.invisibleDefaultLang = false;
    config.pages.invisibleDefaultPage = true;
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(index)`)).toEqual('/la');
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(dummy)`)).toEqual('/la/dummy');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(index)`)).toEqual('/lb');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(dummy)`)).toEqual('/lb/dummy');
  });

  test('replacePageUrl invisible default lang, invisible default page', () => {
    const config: Config = lodash.merge({}, baseConfig);
    config.i18n.invisibleDefaultLang = true;
    config.pages.invisibleDefaultPage = true;
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(index)`)).toEqual('/');
    expect(replacePageUrl(config, 'la', `${URL_PAGE_TAG}(dummy)`)).toEqual('/dummy');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(index)`)).toEqual('/lb');
    expect(replacePageUrl(config, 'lb', `${URL_PAGE_TAG}(dummy)`)).toEqual('/lb/dummy');
  });
});
