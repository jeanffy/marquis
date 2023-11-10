import fs from 'node:fs/promises';
import path from 'node:path';
import { ConsoleColors } from '../console-colors.js';
import { OUTPUT_HTACCESS_NAME } from '../models/config.js';
function getUrlPageFullName(lang, pageName) {
    const items = [lang, pageName].filter(i => i !== '' && i !== undefined && i !== null);
    return items.join('/');
}
export default async function buildHtAccess(config, pages, options) {
    ConsoleColors.info('Creating htaccess');
    const lines = [
        'Options -Indexes',
        'Options -MultiViews',
        'AddDefaultCharset UTF-8',
        'ServerSignature Off',
        'FileETag none',
        '',
        'RewriteEngine On',
        '',
    ];
    if (options.isProd) {
        lines.push(...[
            'RewriteCond %{SERVER_PORT} 80',
            'RewriteCond %{HTTPS} off',
            'RewriteCond %{HTTP:X-Forwarded-Proto} !https',
            'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,END]',
            '',
        ]);
    }
    lines.push(...[
        '# assets',
        `RewriteRule ^${config.assets.outputAssetsFolderName}/(.*)$ ${config.assets.outputAssetsFolderName}/$1 [NC,END]`,
        '',
    ]);
    const downloadableAdditionalFolders = config.additionals.folders.filter(a => a.downloadable === true);
    if (downloadableAdditionalFolders.length > 0) {
        lines.push('# additional folders');
        for (const folder of downloadableAdditionalFolders) {
            lines.push(`RewriteRule ^${folder.path}/(.*)$ ${folder.path}/$1 [NC,END]`);
        }
        lines.push('');
    }
    const downloadableAdditionalFiles = config.additionals.files.filter(a => a.downloadable === true);
    if (downloadableAdditionalFiles.length > 0) {
        lines.push('# additional files');
        for (const file of downloadableAdditionalFiles) {
            lines.push(`RewriteRule ^${file.path}$ ${file.path} [NC,END]`);
        }
        lines.push('');
    }
    for (const lang of config.i18n.availableLanguages) {
        lines.push(`# ${lang}`, '');
        const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
        const pagesForLang = pages.filter(p => p.lang === lang);
        for (const page of pagesForLang) {
            const pageUrl = page.invisible ? '' : page.name;
            lines.push(`# ${page.name}`, `RewriteRule ^${page.outputRelativeNameWithoutExt}\.(css|js)$ ${page.outputRelativeNameWithoutExt}.$1 [NC,END]`, `RewriteRule ^${getUrlPageFullName(langUrl, pageUrl)}$ ${page.outputRelativeNameWithoutExt}.php [NC,END]`);
        }
        lines.push('');
    }
    for (const lang of config.i18n.availableLanguages) {
        const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
        const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
        lines.push(`RewriteCond %{REQUEST_URI} ^/${langUrl}$`, `RewriteRule ^${langUrl}$ /${getUrlPageFullName(langUrl, pageUrl)}  [R=301,END]`);
    }
    lines.push('');
    for (const lang of config.i18n.availableLanguages) {
        const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
        const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
        lines.push(`RewriteCond %{HTTP:Accept-Language} ^${lang} [NC]`, `RewriteRule ^.*$ /${getUrlPageFullName(langUrl, pageUrl)} [R=301,L]`);
    }
    lines.push('');
    const langUrl2 = config.i18n.invisibleDefaultLang ? '' : config.i18n.defaultLang;
    const pageUrl2 = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
    lines.push(`RewriteRule ^.*$ /${getUrlPageFullName(langUrl2, pageUrl2)} [R=301,L,END]`);
    const htaccess = lines.join('\n');
    await fs.writeFile(path.join(config.output.rootOutputDir, OUTPUT_HTACCESS_NAME), htaccess, { encoding: 'utf-8' });
}
//# sourceMappingURL=build-htaccess.js.map