import fs from 'node:fs/promises';
import path from 'node:path';
import jsYaml from 'js-yaml';
import { Config } from '../models/config.js';
import { Page } from '../models/page.js';
import { ConsoleColors } from '../console-colors.js';
import { I18N } from '../models/i18n.js';
import buildPage from './build-page.js';
import buildHtAccess from './build-htaccess.js';
import type { PartialDeep } from 'type-fest';

async function getConfig(): Promise<Config> {
  const configUserPath = path.join(process.cwd(), '.marquis.yml');
  ConsoleColors.info(`Reading config from '${configUserPath}'`);
  const configUserContent = await fs.readFile(configUserPath, { encoding: 'utf-8' });
  const configUser = jsYaml.load(configUserContent) as PartialDeep<Config>;

  const config: Config = {
    i18n: {
      inputLangsDir: 'src/lang',
      availableLanguages: configUser.i18n?.availableLanguages ?? ['en', 'fr'],
      defaultLang: configUser.i18n?.defaultLang ?? 'en',
      invisibleDefaultLang: true,
    },
    pages: {
      outputPagesFolderName: 'pages',
      inputPagesDir: 'src/pages',
      defaultPage: configUser.pages?.defaultPage ?? 'home',
      invisibleDefaultPage: true,
    },
    assets: {
      outputAssetsFolderName: 'assets',
      inputAssetsDir: 'src/assets',
      outputAssetsDir: '',
    },
    additionals: {
      folders: configUser.additionals?.folders ?? [],
      files: configUser.additionals?.files ?? [],
    },
    output: {
      rootOutputDir: 'dist'
    }
  };

  const parsed = path.parse(config.assets.inputAssetsDir);
  config.assets.outputAssetsDir = path.join(config.output.rootOutputDir, parsed.base);

  return config;
}

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
    const i18nContent = await fs.readFile(i18nPath, { encoding: 'utf-8' });
    const i18n = jsYaml.load(i18nContent) as I18N;
    ConsoleColors.info(`Loaded language '${i18nPath}'`);

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

  await fs.cp(path.join('src', 'assets'), path.join('dist', 'assets'), { recursive: true });
  await fs.mkdir(config.assets.outputAssetsDir, { recursive: true });
  await fs.cp(config.assets.inputAssetsDir, config.assets.outputAssetsDir, { recursive: true });
  ConsoleColors.info(`Assets: ${config.assets.inputAssetsDir} -> ${config.assets.outputAssetsDir}`);

  // lang

  await fs.cp(path.join('src', 'lang'), path.join('dist', 'lang'), { recursive: true });

  // additionals

  for (const additional of config.additionals.folders) {
    const inputPath = path.join(additional.baseDir, additional.path);
    const outputPath = path.join('dist', additional.path);
    await fs.cp(inputPath, outputPath, { recursive: true });
    ConsoleColors.info(`Additional folder: ${inputPath} -> ${outputPath}`);
  }

  for (const additional of config.additionals.files) {
    const inputPath = path.join(additional.baseDir, additional.path);
    const outputPath = path.join('dist', additional.path);
    await fs.copyFile(inputPath, outputPath);
    ConsoleColors.info(`Additional file: ${inputPath} -> ${outputPath}`);
  }

  // htaccess

  await buildHtAccess(config, createdPages);
}
