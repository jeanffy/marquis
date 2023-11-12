import { Config, URL_ASSET_TAG } from '../../src/models/config.js';
import { replaceAssetUrl } from '../../src/replace.js';

describe('replaceAssetUrl', () => {
  const baseConfig: Config = {
    serve: {
      port: 0,
    },
    rootDir: 'src',
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
      outputAssetsFolderName: 'assets-output',
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
    expect(replaceAssetUrl(baseConfig, 'xyz')).toEqual('xyz');
  });

  test('with empty tag', () => {
    expect(replaceAssetUrl(baseConfig, `${URL_ASSET_TAG}()`)).toEqual('assets-output');
    expect(replaceAssetUrl(baseConfig, `${URL_ASSET_TAG}( )`)).toEqual('assets-output');
  });

  test('with classic url', () => {
    expect(replaceAssetUrl(baseConfig, `${URL_ASSET_TAG}(img/dummy.jpg)`)).toEqual('assets-output/img/dummy.jpg');
  });

  test('with url with spaces', () => {
    expect(replaceAssetUrl(baseConfig, `${URL_ASSET_TAG}(the images/dummy image.jpg)`)).toEqual(
      'assets-output/the images/dummy image.jpg',
    );
  });

  test.skip('with url with parenthesis', () => {
    expect(replaceAssetUrl(baseConfig, `${URL_ASSET_TAG}(img/dummy(image).jpg)`)).toEqual(
      'assets-output/img/dummy(image).jpg',
    );
  });
});
