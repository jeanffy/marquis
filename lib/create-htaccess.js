import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { OUTPUT_HTACCESS_NAME } from './models/config.js';
function getUrlPageFullName(lang, pageName) {
    const items = [lang, pageName].filter(i => i !== '' && i !== undefined && i !== null);
    return items.join('/');
}
function getPhysicalOutputPageFullName(folderName, lang, pageName) {
    return `${folderName}/${lang}/${pageName}`;
}
// https://htaccess.madewithlove.com
export default async function createHtAccess(config, pages) {
    const lines = [
        'Options -Indexes',
        'Options -MultiViews',
        'AddDefaultCharset UTF-8',
        'ServerSignature Off',
        'FileETag none',
        '',
        'RewriteEngine On',
        '',
        // http -> https redirection
        'RewriteCond %{SERVER_PORT} 80',
        'RewriteCond %{HTTPS} off',
        'RewriteCond %{HTTP:X-Forwarded-Proto} !https',
        'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,END]',
        '',
        // let assets go through
        `RewriteRule ^${config.assets.outputAssetsFolderName}/(.*)$ ${config.assets.outputAssetsFolderName}/$1 [NC,END]`,
        '',
    ];
    // handling all pages php, css, js
    for (const lang of config.i18n.availableLanguages) {
        for (const page of pages) {
            const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
            const pageUrl = page.invisible ? '' : page.name;
            const physicalPageFullName = getPhysicalOutputPageFullName(config.pages.outputPagesFolderName, lang, page.name);
            lines.push(`RewriteRule ^${physicalPageFullName}\.(css|js)$ ${physicalPageFullName}.$1 [NC,END]`, `RewriteRule ^${getUrlPageFullName(langUrl, pageUrl)}$ ${physicalPageFullName}.php [NC,END]`);
        }
        lines.push('');
    }
    // if url contains only language, redirect to default page for that language
    for (const lang of config.i18n.availableLanguages) {
        const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
        const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
        lines.push(`RewriteCond %{REQUEST_URI} ^/${langUrl}$`, `RewriteRule ^${langUrl}$ /${getUrlPageFullName(langUrl, pageUrl)}  [R=301,END]`);
    }
    lines.push('');
    // # redirect to default page for the browser accept language
    for (const lang of config.i18n.availableLanguages) {
        const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
        const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
        lines.push(`RewriteCond %{HTTP:Accept-Language} ^${lang} [NC]`, `RewriteRule ^.*$ /${getUrlPageFullName(langUrl, pageUrl)} [R=301,L]`);
    }
    lines.push('');
    // finally redirect to default page for default language (browser does not have accept language)
    const langUrl = config.i18n.invisibleDefaultLang ? '' : config.i18n.defaultLang;
    const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
    lines.push(`RewriteRule ^.*$ /${getUrlPageFullName(langUrl, pageUrl)} [R=301,L,END]`);
    const htaccess = lines.join('\n');
    await fs.writeFile(path.join(config.output.rootOutputDir, OUTPUT_HTACCESS_NAME), htaccess, { encoding: 'utf-8' });
}
//# sourceMappingURL=create-htaccess.js.map