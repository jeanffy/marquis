import * as fs from 'fs/promises';
import * as path from 'path';
import * as sass from 'sass';
import { CACHEDIR, CONFIG, OUTDIR, PROJDIR } from '../../context';
import { callTwig, exportTemplate, fileExists, fileModifiedAt, getFolderItems, logAction, logActionProgress, promiseSpawn } from '../../helper';
import { BuildCache, fileHasNotChanged } from './cache';

export interface GeneratedPage {
  name: string;
  filePath: string;
}

export interface BuildPagesResult {
  generatedPages: GeneratedPage[];
  updatedCache: BuildCache;
}

export async function buildPages(cache: BuildCache): Promise<BuildPagesResult> {
  const generatedPages: GeneratedPage[] = [];

  logAction('Generating pages');

  await fs.mkdir(path.join(OUTDIR, 'pages'), { recursive: true });

  if (CONFIG.styles !== undefined) {
    await fs.mkdir(path.join(OUTDIR, 'styles'), { recursive: true });
  }
  if (CONFIG.scripts !== undefined) {
    await fs.mkdir(path.join(OUTDIR, 'scripts'), { recursive: true });
  }

  const ext = (CONFIG.pages.ext !== undefined ? CONFIG.pages.ext : 'php');
  const stylesPlaceholder = '<!-- #marquis:styles -->';
  const scriptsPlaceholder = '<!-- #marquis:scripts -->';

  const folderPages = await getFolderItems(path.join(PROJDIR, CONFIG.pages.dir), CONFIG.pages.excludes);
  for (const page of folderPages) {
    let cssEnabled = false;
    if (CONFIG.styles !== undefined) {
      const stylesDir = (CONFIG.styles.dir !== undefined ? CONFIG.styles.dir : CONFIG.pages.dir);
      const scssPath = path.join(PROJDIR, stylesDir, `${page.name}.scss`);
      if (await fileExists(scssPath)) {
        if (await fileHasNotChanged(cache, scssPath)) {
          logActionProgress(`Skipped style '${page.name}.scss' (not modified)`, true);
        } else {
          const fileParse = path.parse(scssPath);
          const res = sass.compile(scssPath, { style: 'compressed' });
          await fs.writeFile(path.join(OUTDIR, 'styles', `${fileParse.name}.css`), res.css, { encoding: 'utf-8' });
          logActionProgress(`Emitted style '${fileParse.name}.css'`);
        }
        cssEnabled = true;
      }
    }

    let jsEnabled = false;
    if (CONFIG.scripts !== undefined) {
      const scriptsDir = (CONFIG.scripts.dir !== undefined ? CONFIG.scripts.dir : CONFIG.pages.dir);
      const tsPath = path.join(PROJDIR, scriptsDir, `${page.name}.ts`);
      if (await fileExists(tsPath)) {
        if (await fileHasNotChanged(cache, tsPath)) {
          logActionProgress(`Skipped script '${page.name}.ts' (not modified)`, true);
        } else {
          const tsConfigPath = await exportTemplate('tsconfig.json.twig', CACHEDIR, 'tsconfig.json', {
            typeRoots: (CONFIG.scripts.typeRoots !== undefined ? CONFIG.scripts.typeRoots.map(tr => `"${tr}"`).join(',') : '')
          });
          const fileParse = path.parse(tsPath);
          const webpackConfigPath = await exportTemplate('webpack.config.js.twig', CACHEDIR, 'webpack.config.js', {
            entryPath: tsPath,
            outBundleDir: path.join(OUTDIR, 'scripts'),
            outBundleName: `${fileParse.name}.js`,
            tsConfigPath: tsConfigPath
          });
          await promiseSpawn(`npx webpack -c '${webpackConfigPath}'`, {
            shell: true,
            stdio: 'inherit',
            //shell:
          });

          // const tsConfigPath = await exportTemplate('tsconfig.json.twig', CACHEDIR, 'tsconfig.json', {
          //   typeRoots: (CONFIG.scripts.typeRoots !== undefined ? CONFIG.scripts.typeRoots.map(tr => `"${tr}"`).join(',') : ''),
          //   outBundleDir: path.join(OUTDIR, 'scripts'),
          //   outBundleName: `${fileParse.name}.js`
          // });

          // await promiseSpawn(`npx tsc -p '${tsConfigPath}'`, {
          //   shell: true,
          //   stdio: 'inherit',
          //   //shell:
          // });

          logActionProgress(`Emitted script '${fileParse.name}.js'`);
        }
        jsEnabled = true;
      }
    }

    const processFunc = (content: string): string => {
      if (cssEnabled) {
        content = content.replace(stylesPlaceholder, `<link rel="stylesheet" href="../styles/${page.name}.css">`);
      } else {
        content = content.replace(stylesPlaceholder, '');
      }
      if (jsEnabled) {
        content = content.replace(scriptsPlaceholder, `<script src="../scripts/${page.name}.js"></script>`);
      } else {
        content = content.replace(scriptsPlaceholder, '');
      }
      return content;
    }

    const generatedPath = path.join(OUTDIR, 'pages', `${page.name}.${ext}`);

    if (await fileHasNotChanged(cache, page.filePath)) {
      logActionProgress(`Skipped page '${page.name}' (not modified)`, true);
    } else {
       switch (page.pageType) {
        case 'twig': {
          await callTwig(page.filePath, generatedPath, processFunc);
          break;
        }
        case 'php':
        case 'html': {
          let content = await fs.readFile(page.filePath, { encoding: 'utf-8' });
          content = processFunc(content);
          await fs.writeFile(generatedPath, content, { encoding: 'utf-8' });
          break;
        }
      }

      logActionProgress(`Emitted page '${page.name}'`);
    }

    generatedPages.push({
      name: page.name,
      filePath: generatedPath
    });
  }

  return {
    generatedPages: generatedPages,
    updatedCache: cache
  };
}
