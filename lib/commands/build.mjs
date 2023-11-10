import fs from 'node:fs/promises';
import path from 'node:path';
import jsYaml from 'js-yaml';
import { ConsoleColors } from '../console-colors.mjs';
import buildPage from './build-page.mjs';
import buildHtAccess from './build-htaccess.mjs';
import { getConfig } from '../core.mjs';
import { compileScss, emptyDirectory } from '../utils.mjs';
import { replaceAssetUrlForStyle } from '../replace.mjs';
export default async function build(args) {
    if (args.length > 1) {
        throw new Error('Too many arguments to build command');
    }
    let isProd = false;
    if (args.length === 1) {
        const argValue = args[0];
        if (argValue !== '--prod') {
            throw new Error(`Unknwon build command argument '${argValue}'`);
        }
        else {
            isProd = true;
        }
    }
    if (isProd) {
        ConsoleColors.warning('Building for production');
    }
    const config = await getConfig();
    await fs.mkdir(config.output.rootOutputDir, { recursive: true });
    await emptyDirectory(config.output.rootOutputDir);
    ConsoleColors.info(`Building in '${config.output.rootOutputDir}'`);
    const pagesOutputFolderPath = path.join(config.output.rootOutputDir, config.pages.outputPagesFolderName);
    await fs.mkdir(pagesOutputFolderPath, { recursive: true });
    let pagesEnt = await fs.readdir(config.pages.inputPagesDir, { withFileTypes: true });
    pagesEnt = pagesEnt.filter(p => p.isDirectory());
    const createdPages = [];
    for (const lang of config.i18n.availableLanguages) {
        const i18nPath = path.join(config.i18n.inputLangsDir, `${lang}.yml`);
        ConsoleColors.info(`Loading language '${i18nPath}'`);
        const i18nContent = await fs.readFile(i18nPath, { encoding: 'utf-8' });
        const i18n = jsYaml.load(i18nContent);
        for (const pageEnt of pagesEnt) {
            const createdPage = await buildPage({
                config,
                i18n,
                lang,
                name: pageEnt.name,
                inputFolder: pageEnt.path,
                outputFolder: pagesOutputFolderPath
            });
            createdPages.push(createdPage);
        }
    }
    ConsoleColors.info(`Assets: ${config.assets.inputAssetsDir} -> ${config.assets.outputAssetsDir}`);
    await fs.mkdir(config.assets.outputAssetsDir, { recursive: true });
    const assetItems = await fs.readdir(config.assets.inputAssetsDir, { recursive: true, withFileTypes: true });
    for (const assetItem of assetItems) {
        let itemPathInput = path.join(assetItem.path, assetItem.name);
        let itemPathOutput = itemPathInput.substring(config.assets.inputAssetsDir.length + 1);
        itemPathOutput = path.join(config.assets.outputAssetsDir, itemPathOutput);
        if (assetItem.isDirectory()) {
            await fs.mkdir(itemPathOutput, { recursive: true });
        }
        else {
            const parsed = path.parse(itemPathOutput);
            if (parsed.ext === '.scss') {
                let output = await compileScss(itemPathInput);
                output = await replaceAssetUrlForStyle(config, parsed.dir, output);
                await fs.writeFile(path.join(parsed.dir, `${parsed.name}.css`), output, { encoding: 'utf-8' });
            }
            else {
                await fs.copyFile(itemPathInput, itemPathOutput);
            }
        }
    }
    const langInputPath = path.join('src', 'lang');
    const langOutputPath = path.join('dist', 'lang');
    ConsoleColors.info(`Lang: ${langInputPath} -> ${langOutputPath}`);
    await fs.cp(langInputPath, langOutputPath, { recursive: true });
    for (const additional of config.additionals.folders) {
        const inputPath = path.join(additional.baseDir, additional.path);
        const outputPath = path.join('dist', additional.path);
        ConsoleColors.info(`Additional folder: ${inputPath} -> ${outputPath}`);
        await fs.cp(inputPath, outputPath, { recursive: true });
    }
    for (const additional of config.additionals.files) {
        const inputPath = path.join(additional.baseDir, additional.path);
        const outputPath = path.join('dist', additional.path);
        ConsoleColors.info(`Additional file: ${inputPath} -> ${outputPath}`);
        await fs.copyFile(inputPath, outputPath);
    }
    await buildHtAccess(config, createdPages, { isProd: isProd });
}
//# sourceMappingURL=build.mjs.map