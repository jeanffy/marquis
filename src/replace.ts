import path from 'node:path';
import lodash from 'lodash';
import { Config, I18N_TAG, LANG_TAG, URL_ASSET_TAG, URL_LANG_TAG, URL_PAGE_TAG } from './models/config.js';
import { I18N } from './models/i18n.js';

function replaceTag(input: string, tag: string, replaceFn: (tagArg: string) => string): string {
  let output = input;

  const tagRegExp = new RegExp(`${tag.replace('$', '\\$')}\\((.*?)\\)`, 'g');
  const foundTags = input.match(tagRegExp);
  if (foundTags !== null) {
    for (const foundTag of foundTags) {
      const tagArg = foundTag
        .slice(tag.length + 1)
        .slice(0, -1)
        .trim();
      const newValue = replaceFn(tagArg);
      output = output.replaceAll(foundTag, newValue);
    }
  }

  return output;
}

export function replaceI18N(i18n: I18N, input: string): string {
  return replaceTag(input, I18N_TAG, (tradPath: string): string => {
    const trad = lodash.get(i18n, tradPath);
    if (trad !== undefined && typeof trad === 'string') {
      return trad;
    }
    return tradPath;
  });
}

export function replaceLang(lang: string, input: string): string {
  return replaceTag(input, LANG_TAG, (_p: string): string => {
    return lang;
  });
}

export function replacePageUrl(config: Config, lang: string, input: string): string {
  return replaceTag(input, URL_PAGE_TAG, (p: string): string => {
    const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
    const pageUrl = p === config.pages.defaultPage && config.pages.invisibleDefaultPage ? '' : p;
    const items = [langUrl, pageUrl].filter(i => i !== '' && i !== undefined && i !== null);
    return `/${items.join('/')}`;
  });
}

export function replaceLangUrl(config: Config, input: string): string {
  return replaceTag(input, URL_LANG_TAG, (p: string): string => {
    const langUrl = p === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : p;
    const items = [langUrl].filter(i => i !== '' && i !== undefined && i !== null);
    return `/${items.join('/')}`;
  });
}

export function replaceAssetUrl(config: Config, input: string): string {
  return replaceTag(input, URL_ASSET_TAG, (p: string): string => {
    if (p.trim() === '') {
      return config.assets.outputAssetsFolderName;
    }
    return `${config.assets.outputAssetsFolderName}/${p}`;
  });
}

export function replaceAssetUrlForStyle(config: Config, pageOutputDir: string, input: string): string {
  return replaceTag(input, URL_ASSET_TAG, (p: string): string => {
    const relPath = path.relative(pageOutputDir, path.join(config.assets.outputAssetsDir, p));
    return relPath;
  });
}
