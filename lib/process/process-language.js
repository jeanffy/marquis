import * as fs from 'node:fs/promises';
import * as path from 'path';
import * as jsYaml from 'js-yaml';
import processPages from './process-pages.js';
import { ConsoleColors } from '../console-colors.js';
export default async function processLanguage(config, lang) {
    const i18nPath = path.join(config.i18n.inputLangsDir, `${lang}.yml`);
    const i18nContent = await fs.readFile(i18nPath, { encoding: 'utf-8' });
    const i18n = jsYaml.load(i18nContent);
    ConsoleColors.info(`Loaded language '${i18nPath}'`);
    return processPages({
        config: config,
        i18n: i18n,
        lang: lang
    });
}
//# sourceMappingURL=process-language.js.map