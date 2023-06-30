import fs from 'node:fs/promises';
import path from 'node:path';
import jsYaml from 'js-yaml';
import { Page } from '../models/page.mjs';
import { ConsoleColors } from '../console-colors.mjs';
import { I18N } from '../models/i18n.mjs';
import buildPage from './build-page.mjs';
import buildHtAccess from './build-htaccess.mjs';
import { getConfig } from '../core.mjs';

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
  await fs.cp(path.join('src', 'assets'), path.join('dist', 'assets'), { recursive: true });
  await fs.mkdir(config.assets.outputAssetsDir, { recursive: true });
  await fs.cp(config.assets.inputAssetsDir, config.assets.outputAssetsDir, { recursive: true });

  // lang

  const langInputPath = path.join('src', 'lang');
  const langOutputPath = path.join('dist', 'lang');
  ConsoleColors.info(`Lang: ${config.assets.inputAssetsDir} -> ${config.assets.outputAssetsDir}`);
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
