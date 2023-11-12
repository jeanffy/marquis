import fs from 'node:fs/promises';
import path from 'node:path';
import jsYaml from 'js-yaml';
import minimist from 'minimist';
import Watcher from 'watcher';
import { ConsoleColors } from '../console-colors.js';
import { getConfig } from '../core.js';
import { Config } from '../models/config.js';
import { I18N } from '../models/i18n.js';
import { Page } from '../models/page.js';
import { replaceAssetUrlForStyle } from '../replace.js';
import { compileScss, emptyDirectory } from '../utils.js';
import buildHtAccess from './build-htaccess.js';
import buildPage from './build-page.js';

interface BuildArgsDef {
  production?: boolean;
  watch?: boolean;
}

class BuildArgs implements BuildArgsDef {
  public production: boolean;
  public watch: boolean;

  public constructor(args: string[]) {
    const parsedArgs = minimist(args) as BuildArgsDef;
    this.production = parsedArgs.production === true;
    this.watch = parsedArgs.watch === true;
  }
}

export default async function build(args: string[]): Promise<void> {
  const buildArgs = new BuildArgs(args);
  const config = await getConfig();

  if (buildArgs.watch) {
    const watcher = new Watcher(config.rootDir, {
      ignoreInitial: true,
      recursive: true
    });
    watcher.on('all', (_event, _targetPath, _targetPathNext) => {
      ConsoleColors.warning('*** File change detected, rebuilding...');
      setTimeout(() => {
        doBuild(buildArgs, config).then(() => {
          ConsoleColors.warning('*** Watching for changes');
        }).catch(error => {
          ConsoleColors.error('*** Error detected', error);
        });
      }, 500);
    });
  }

  await doBuild(buildArgs, config);

  if (buildArgs.watch) {
    ConsoleColors.warning('*** Watching for changes');
  }
}

async function doBuild(args: BuildArgs, config: Config): Promise<void> {
  if (args.production) {
    ConsoleColors.warning('Building for production');
  }

  await fs.mkdir(config.output.rootOutputDir, { recursive: true });
  await emptyDirectory(config.output.rootOutputDir);

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
        outputFolder: pagesOutputFolderPath,
      });
      createdPages.push(createdPage);
    }
  }

  // assets

  ConsoleColors.info(`Assets: ${config.assets.inputAssetsDir} -> ${config.assets.outputAssetsDir}`);
  await fs.mkdir(config.assets.outputAssetsDir, { recursive: true });
  const assetItems = await fs.readdir(config.assets.inputAssetsDir, { recursive: true, withFileTypes: true });
  for (const assetItem of assetItems) {
    const itemPathInput = path.join(assetItem.path, assetItem.name);
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
        output = replaceAssetUrlForStyle(config, parsed.dir, output);
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

  await buildHtAccess(config, createdPages, {
    production: args.production
  });
}
