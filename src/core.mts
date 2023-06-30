import fs from 'node:fs/promises';
import path from 'node:path';
import jsYaml from 'js-yaml';
import { ConsoleColors } from './console-colors.mjs';
import { Config } from './models/config.mjs';
import { PartialDeep } from 'type-fest';

export async function getConfig(): Promise<Config> {
  const configUserPath = path.join(process.cwd(), '.marquis.yml');
  ConsoleColors.info(`Reading config from '${configUserPath}'`);
  const configUserContent = await fs.readFile(configUserPath, { encoding: 'utf-8' });
  const configUser = jsYaml.load(configUserContent) as PartialDeep<Config>;

  const config: Config = {
    serve: {
      port: configUser.serve?.port ?? 8080,
    },
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

export interface PackageJson {
  name: string;
}

export async function getPackageJson(): Promise<PackageJson> {
  const userPackageJsonPath = path.join(process.cwd(), 'package.json');
  const userPackageJsonContent = await fs.readFile(userPackageJsonPath, { encoding: 'utf-8' });
  const userPackageJson = JSON.parse(userPackageJsonContent);
  return userPackageJson;
}
