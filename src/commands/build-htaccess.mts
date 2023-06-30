import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Config,  OUTPUT_HTACCESS_NAME } from '../models/config.mjs';
import { Page } from '../models/page.mjs';
import { ConsoleColors } from '../console-colors.mjs';

function getUrlPageFullName(lang: string, pageName: string): string {
  const items = [lang, pageName].filter(i => i !== '' && i !== undefined && i !== null);
  return items.join('/');
}

// https://htaccess.madewithlove.com
export default async function buildHtAccess(config: Config, pages: Page[]): Promise<void> {
  ConsoleColors.info('Creating htaccess');

  const lines: string[] = [
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
    '# assets',
    `RewriteRule ^${config.assets.outputAssetsFolderName}/(.*)$ ${config.assets.outputAssetsFolderName}/$1 [NC,END]`,
    '',
  ];

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

  // handling all pages php, css, js
  for (const lang of config.i18n.availableLanguages) {
    lines.push(
      `# ${lang}`,
      '',
      );
    const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;

    const pagesForLang = pages.filter(p => p.lang === lang);
    for (const page of pagesForLang) {
      const pageUrl = page.invisible ? '' : page.name;
      lines.push(
        `# ${page.name}`,
        `RewriteRule ^${page.outputRelativeNameWithoutExt}\.(css|js)$ ${page.outputRelativeNameWithoutExt}.$1 [NC,END]`,
        `RewriteRule ^${getUrlPageFullName(langUrl, pageUrl)}$ ${page.outputRelativeNameWithoutExt}.php [NC,END]`,
      );
    }

    lines.push('');
  }

  // if url contains only language, redirect to default page for that language
  for (const lang of config.i18n.availableLanguages) {
    const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
    const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
    lines.push(
      `RewriteCond %{REQUEST_URI} ^/${langUrl}$`,
      `RewriteRule ^${langUrl}$ /${getUrlPageFullName(langUrl, pageUrl)}  [R=301,END]`,
    );
  }

  lines.push('');

  // # redirect to default page for the browser accept language
  for (const lang of config.i18n.availableLanguages) {
    const langUrl = lang === config.i18n.defaultLang && config.i18n.invisibleDefaultLang ? '' : lang;
    const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
    lines.push(
      `RewriteCond %{HTTP:Accept-Language} ^${lang} [NC]`,
      `RewriteRule ^.*$ /${getUrlPageFullName(langUrl, pageUrl)} [R=301,L]`,
    );
  }

  lines.push('');

  // finally redirect to default page for default language (browser does not have accept language)
  const langUrl = config.i18n.invisibleDefaultLang ? '' : config.i18n.defaultLang;
  const pageUrl = config.pages.invisibleDefaultPage ? '' : config.pages.defaultPage;
  lines.push(`RewriteRule ^.*$ /${getUrlPageFullName(langUrl, pageUrl)} [R=301,L,END]`);

  const htaccess = lines.join('\n');
  await fs.writeFile(path.join(config.output.rootOutputDir, OUTPUT_HTACCESS_NAME), htaccess, { encoding: 'utf-8' });
}