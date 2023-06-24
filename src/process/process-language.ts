import * as fs from 'node:fs/promises';
import * as path from 'path';
import * as jsYaml from 'js-yaml';
import { Config } from '../models/config.js';
import { I18N } from '../models/i18n.js';
import processPages from './process-pages.js';
import { Page } from '../models/page.js';
import { ConsoleColors } from '../console-colors.js';

export default async function processLanguage(config: Config, lang: string): Promise<Page[]> {
  const i18nPath = path.join(config.i18n.inputLangsDir, `${lang}.yml`);
  const i18nContent = await fs.readFile(i18nPath, { encoding: 'utf-8' });
  const i18n = jsYaml.load(i18nContent) as I18N;
  ConsoleColors.info(`Loaded language '${i18nPath}'`);
  return processPages({
    config: config,
    i18n: i18n,
    lang: lang
  });
}
