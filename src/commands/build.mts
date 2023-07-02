import fs from 'node:fs/promises';
import path from 'node:path';
import jsYaml from 'js-yaml';
import { Page } from '../models/page.mjs';
import { ConsoleColors } from '../console-colors.mjs';
import { I18N } from '../models/i18n.mjs';
import buildPage from './build-page.mjs';
import buildHtAccess from './build-htaccess.mjs';
import { getConfig } from '../core.mjs';
import { compileScss } from '../utils.mjs';
import { replaceAssetUrlForStyle } from '../replace.mjs';

export default async function build(): Promise<void> {
  const config = await getConfig();

  await fs.rm(config.output.rootOutputDir, { recursive: true, force: true });
  await fs.mkdir(config.output.rootOutputDir, { recursive: true });

  ConsoleColors.info(`Building in '${config.output.rootOutputDir}'`);

  // pages

  const pagesOutputFolderPath = path.join(config.output.rootOutputDir, config.pages.outputPagesFolderName);
  await fs.mkdir(pagesOutputFolderPath, { recursive: true });

  let pagesEnt = await fs.readdir(config.pages.inputPagesDir, { withFileTypes: true });
  pagesEnt = pagesEnt.filter(p => p.isDirectory());

  const createdPages: Page[] = [];

  for (const lang of config.i18n.availableLanguages) {
    const i18nPath = path.join(config.i18n.inputLangsDir, `${lang}.yml`);
    ConsoleColors.info(`Loading language '${i18nPath}'`);

    const i18nContent = await fs.readFile(i18nPath, { encoding: 'utf-8' });
    const i18n = jsYaml.load(i18nContent) as I18N;

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

  // assets

  ConsoleColors.info(`Assets: ${config.assets.inputAssetsDir} -> ${config.assets.outputAssetsDir}`);
  await fs.mkdir(config.assets.outputAssetsDir, { recursive: true });
  const assetItems = await fs.readdir(config.assets.inputAssetsDir, { recursive: true, withFileTypes: true });
  for (const assetItem of assetItems) {
    let itemPathInput = path.join(assetItem.path, assetItem.name);
    // if config.assets.inputAssetsDir = 'src/assets' and assetItem.path = 'src/assets/foo/bar/baz' (folder) -> 'foo/bar/baz'
    // if config.assets.inputAssetsDir = 'src/assets' and assetItem.path = 'src/assets/foo/bar/dummy.css' (file) -> 'foo/bar/dummy.css'
    let itemPathOutput = itemPathInput.substring(config.assets.inputAssetsDir.length + 1);
    itemPathOutput = path.join(config.assets.outputAssetsDir, itemPathOutput);
    if (assetItem.isDirectory()) {
      await fs.mkdir(itemPathOutput, { recursive: true });
    } else {
      const parsed = path.parse(itemPathOutput);
      if (parsed.ext === '.scss') {
        let output = await compileScss(itemPathInput);
        output = await replaceAssetUrlForStyle(config, parsed.dir, output);
        await fs.writeFile(path.join(parsed.dir, `${parsed.name}.css`), output, { encoding: 'utf-8' });
      } else {
        await fs.copyFile(itemPathInput, itemPathOutput);
      }
    }
  }

  // lang

  const langInputPath = path.join('src', 'lang');
  const langOutputPath = path.join('dist', 'lang');
  ConsoleColors.info(`Lang: ${langInputPath} -> ${langOutputPath}`);
  await fs.cp(langInputPath, langOutputPath, { recursive: true });

  // additionals

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

  // htaccess

  await buildHtAccess(config, createdPages);
}
