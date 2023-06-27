import * as path from 'node:path';
import lodash from 'lodash';
import { I18N_TAG, LANG_TAG, URL_PAGE_TAG, URL_LANG_TAG, URL_ASSET_TAG } from './models/config.mjs';
function replaceTag(input, tag, replaceFn) {
    let output = input;
    const tagRegExp = new RegExp(`${tag.replace('$', '\\\$')}\\((.*?)\\)`, 'g');
    const foundTags = input.match(tagRegExp);
    if (foundTags !== null) {
        for (const foundTag of foundTags) {
            const tagArg = foundTag.slice(tag.length + 1).slice(0, -1).trim();
            const newValue = replaceFn(tagArg);
            output = output.replaceAll(foundTag, newValue);
        }
    }
    return output;
}
export async function replaceI18N(i18n, input) {
    return replaceTag(input, I18N_TAG, (tradPath) => {
        const trad = lodash.get(i18n, tradPath);
        if (trad !== undefined && typeof trad === 'string') {
            return trad;
        }
        return tradPath;
    });
}
export async function replaceLang(lang, input) {
    return replaceTag(input, LANG_TAG, (_p) => {
        return lang;
    });
}
export async function replacePageUrl(config, lang, input) {
    return replaceTag(input, URL_PAGE_TAG, (p) => {
        const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
        const pageUrl = p === config.pages.defaultPage && config.pages.invisibleDefaultPage ? '' : p;
        const items = [langUrl, pageUrl].filter(i => i !== '' && i !== undefined && i !== null);
        return `/${items.join('/')}`;
    });
}
export async function replaceLangUrl(config, input) {
    return replaceTag(input, URL_LANG_TAG, (p) => {
        const langUrl = p === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : p;
        const items = [langUrl].filter(i => i !== '' && i !== undefined && i !== null);
        return `/${items.join('/')}`;
    });
}
export async function replaceAssetUrl(config, input) {
    return replaceTag(input, URL_ASSET_TAG, (p) => `${config.assets.outputAssetsFolderName}/${p}`);
}
export async function replaceAssetUrlForStyle(config, pageOutputDir, input) {
    return replaceTag(input, URL_ASSET_TAG, (p) => {
        const relPath = path.relative(pageOutputDir, path.join(config.assets.outputAssetsDir, p));
        return relPath;
    });
}
//# sourceMappingURL=replace.mjs.map