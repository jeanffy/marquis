import path from 'node:path';

const rootDir = path.resolve('.');

const srcDir = path.join(rootDir, 'src');

const srcAssetsDir = path.join(srcDir, 'assets');
const srcAssetsImagesDir = path.join(srcAssetsDir, 'images');
const srcAssetsScriptsJsDir = path.join(srcAssetsDir, 'js');
const srcAssetsScriptsPhpDir = path.join(srcAssetsDir, 'php');
const srcAssetsStylesDir = path.join(srcAssetsDir, 'styles');

const srcI18NDir = path.join(srcDir, 'i18n');
function srcI18NYaml(langName: string): string {
  return path.join(srcI18NDir, `${langName}.yaml`);
}

const srcLayoutsDir = path.join(srcDir, 'layouts');

const srcViewsDir = path.join(srcDir, 'views');

const srcIndexPhp = path.join(srcDir, 'index.php');

const srcRuntimeDir = path.join(import.meta.dirname, 'runtime');
const srcRuntimePhpDir = path.join(srcRuntimeDir, 'php');
const srcRuntimeHtAccess = path.join(srcRuntimeDir, '.htaccess');
const srcRuntimeDockerCompose = path.join(srcRuntimeDir, 'docker-compose.yaml');

const distDir = path.join(rootDir, 'dist');

const distAssetsDir = path.join(distDir, 'assets');
const distAssetsImagesDir = path.join(distAssetsDir, 'images');
const distAssetsScriptsJsDir = path.join(distAssetsDir, 'js');
const distAssetsScriptsPhpDir = path.join(distAssetsDir, 'php');
const distAssetsStylesDir = path.join(distAssetsDir, 'styles');

const distI18NDir = path.join(distDir, 'i18n');
function distI18NJson(langName: string): string {
  return path.join(distI18NDir, `${langName}.json`);
}

const distLayoutsDir = path.join(distDir, 'layouts');

const distViewsDir = path.join(distDir, 'views');

const distHtAccess = path.join(distDir, '.htaccess');
const distIndexPhp = path.join(distDir, 'index.php');

const distRuntimeDir = path.join(distDir, 'marquis');
const distRuntimePhpDir = path.join(distRuntimeDir, 'php');
const distRuntimeHtAccess = path.join(distDir, '.htaccess');

export default {
  rootDir,

  srcDir,

  srcAssetsDir,
  srcAssetsImagesDir,
  srcAssetsScriptsJsDir,
  srcAssetsScriptsPhpDir,
  srcAssetsStylesDir,

  srcI18NDir,
  srcI18NYaml,

  srcLayoutsDir,

  srcViewsDir,

  srcIndexPhp,

  srcRuntimeDir,
  srcRuntimePhpDir,
  srcRuntimeHtAccess,
  srcRuntimeDockerCompose,

  distDir,
  distI18NJson,

  distAssetsDir,
  distAssetsImagesDir,
  distAssetsScriptsJsDir,
  distAssetsScriptsPhpDir,
  distAssetsStylesDir,

  distI18NDir,

  distLayoutsDir,

  distViewsDir,

  distHtAccess,
  distIndexPhp,

  distRuntimeDir,
  distRuntimePhpDir,
  distRuntimeHtAccess,
};
