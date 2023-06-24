import * as fs from 'node:fs/promises';
import * as path from 'node:path';
// import * as url from 'node:url';
// import * as util from 'node:util';
import * as jsYaml from 'js-yaml';
import processAssets from '../process/process-assets.js';
import createHtAccess from '../create-htaccess.js';
import processLanguage from '../process/process-language.js';
import { ConsoleColors } from '../console-colors.js';
export default async function build() {
    const configUserPath = path.join(process.cwd(), '.marquis.yml');
    ConsoleColors.info(`Reading config from '${configUserPath}'`);
    const configUserContent = await fs.readFile(configUserPath, { encoding: 'utf-8' });
    const configUser = jsYaml.load(configUserContent);
    const config = {
        i18n: {
            inputLangsDir: 'src/lang',
            availableLanguages: configUser.i18n.availableLanguages ?? ['en', 'fr'],
            defaultLang: configUser.i18n.defaultLang ?? 'en',
            invisibleDefaultLang: true,
        },
        pages: {
            outputPagesFolderName: 'pages',
            inputPagesDir: 'src/pages',
            defaultPage: configUser.pages.defaultPage ?? 'home',
            invisibleDefaultPage: true,
        },
        assets: {
            outputAssetsFolderName: 'assets',
            inputAssetsDir: 'src/assets',
            outputAssetsDir: '',
        },
        output: {
            rootOutputDir: 'dist'
        }
    };
    const parsed = path.parse(config.assets.inputAssetsDir);
    config.assets.outputAssetsDir = path.join(config.output.rootOutputDir, parsed.name);
    await fs.rm(config.output.rootOutputDir, { recursive: true, force: true });
    await fs.mkdir(config.output.rootOutputDir, { recursive: true });
    ConsoleColors.info(`Building in '${config.output.rootOutputDir}'`);
    const createdPages = [];
    for (const lang of config.i18n.availableLanguages) {
        const processedPages = await processLanguage(config, lang);
        for (const processedPage of processedPages) {
            if (createdPages.find(p => p.name === processedPage.name) === undefined) {
                createdPages.push(processedPage);
            }
        }
    }
    await processAssets(config);
    await createHtAccess(config, createdPages);
}
//# sourceMappingURL=build.js.map