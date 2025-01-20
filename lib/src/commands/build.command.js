import path from 'node:path';
import yaml from 'yaml';
import pathes from '../pathes.js';
import { RealCompileScssAdapter } from '../adapters/real-compile-scss.adapter.js';
import { RealCompileTsAdapter } from '../adapters/real-compile-ts.adapter.js';
import { ViewsHandler } from '../views-handler.js';
import { RealFsAdapter } from '../adapters/real-fs.adapter.js';
import { DryRunFsAdapter } from '../adapters/dry-run-fs.adapter.js';
import { LayoutsHandler } from '../layouts-handler.js';
let fsPort = new RealFsAdapter();
if (process.env.DRYRUN === '1') {
    fsPort = new DryRunFsAdapter();
}
const compileScssProvider = new RealCompileScssAdapter();
const compileTsProvider = new RealCompileTsAdapter();
export async function buildCommand(args) {
    if (args.length === 1 && args[0] === '--prod') {
        process.env.MARQUIS_BUILD_PROD = '1';
        console.log(`🚨 production build`);
    }
    const start = new Date().getTime();
    await fsPort.mkdir(pathes.distDir);
    await clearDist();
    await buildProject();
    console.log(`✅ done (${new Date().getTime() - start}ms)`);
}
async function clearDist() {
    const start = new Date().getTime();
    const distItems = await fsPort.readdir(pathes.distDir);
    for (const distItem of distItems) {
        if (distItem.name !== 'vendor') {
            const itemPath = path.join(distItem.parentPath, distItem.name);
            if (distItem.isDirectory) {
                await fsPort.rm(itemPath);
            }
            else if (distItem.isFile) {
                await fsPort.unlink(itemPath);
            }
            else {
                console.warn(`cannot remove '${itemPath}'`);
            }
        }
    }
    console.log(`🧹 clear (${new Date().getTime() - start}ms)`);
}
async function buildProject() {
    await buildAssetsFolder();
    await buildI18NFolder();
    await buildLayoutsFolder();
    await buildViewsFolder();
    await buildHtAccess();
    await buildIndexPhp();
    await createRuntimePhp();
    await postProcessDir(pathes.distDir);
}
async function buildAssetsFolder() {
    const start = new Date().getTime();
    await buildAssetsImagesFolder();
    await buildAssetsScriptsJsFolder();
    await buildAssetsScriptsPhpFolder();
    await buildAssetsStylesFolder();
    console.log(`📦 assets (${new Date().getTime() - start}ms)`);
}
async function buildAssetsImagesFolder() {
    await fsPort.cp(pathes.srcAssetsImagesDir, pathes.distAssetsImagesDir);
}
async function buildAssetsScriptsJsFolder() {
    await fsPort.cp(pathes.srcAssetsScriptsJsDir, pathes.distAssetsScriptsJsDir);
}
async function buildAssetsScriptsPhpFolder() {
    await fsPort.cp(pathes.srcAssetsScriptsPhpDir, pathes.distAssetsScriptsPhpDir);
}
async function buildAssetsStylesFolder() {
    await fsPort.mkdir(pathes.distAssetsStylesDir);
    const styleItems = await fsPort.readdir(pathes.srcAssetsStylesDir, { recursive: true });
    for (const styleItem of styleItems) {
        if (['.css', '.woff', '.ttf'].includes(path.parse(styleItem.name).ext)) {
            await fsPort.copyFile(path.join(pathes.srcAssetsStylesDir, styleItem.name), path.join(pathes.distAssetsStylesDir, styleItem.name));
        }
    }
}
async function buildI18NFolder() {
    const start = new Date().getTime();
    await fsPort.mkdir(pathes.distI18NDir);
    const i18nItems = await fsPort.readdir(pathes.srcI18NDir);
    for (const i18nItem of i18nItems) {
        const langName = path.parse(i18nItem.name).name;
        const yamlContent = await fsPort.readFile(pathes.srcI18NYaml(langName));
        const yamlDoc = yaml.parseDocument(yamlContent);
        const jsonContent = yamlDoc.toJSON();
        await fsPort.writeFile(pathes.distI18NJson(langName), JSON.stringify(jsonContent));
    }
    console.log(`🌍 i18n (${new Date().getTime() - start}ms)`);
}
async function buildLayoutsFolder() {
    const start = new Date().getTime();
    const layoutsHandler = new LayoutsHandler(fsPort, compileScssProvider, compileTsProvider, pathes.srcLayoutsDir, pathes.distLayoutsDir);
    await layoutsHandler.handleDirectory('');
    console.log(`🛠️ layouts (${new Date().getTime() - start}ms)`);
}
async function buildViewsFolder() {
    const start = new Date().getTime();
    const viewsHandler = new ViewsHandler(fsPort, compileScssProvider, compileTsProvider, pathes.srcViewsDir, pathes.distViewsDir);
    await viewsHandler.handleDirectory('');
    await viewsHandler.handleDirectory('_404');
    console.log(`🌇 views (${new Date().getTime() - start}ms)`);
}
async function buildHtAccess() {
    const start = new Date().getTime();
    let htAccessContent = await fsPort.readFile(pathes.srcRuntimeHtAccess);
    if (process.env.MARQUIS_BUILD_PROD === '1') {
        htAccessContent = htAccessContent.replace(/#if:MARQUIS_BUILD_PROD/gm, '');
        htAccessContent = htAccessContent.replace(/#endif:MARQUIS_BUILD_PROD/gm, '');
    }
    else {
        htAccessContent = htAccessContent.replace(/#if:MARQUIS_BUILD_PROD(.|\n)*#endif:MARQUIS_BUILD_PROD/gm, '');
    }
    await fsPort.writeFile(pathes.distHtAccess, htAccessContent);
    console.log(`📋 .htaccess (${new Date().getTime() - start}ms)`);
}
async function buildIndexPhp() {
    const start = new Date().getTime();
    await fsPort.copyFile(pathes.srcIndexPhp, pathes.distIndexPhp);
    console.log(`🏁 index (${new Date().getTime() - start}ms)`);
}
async function postProcessDir(dir) {
    let appBaseHref = process.env.APP_BASE_URL ?? '';
    if (appBaseHref === '/') {
        appBaseHref = '';
    }
    const items = await fsPort.readdir(dir);
    for (const item of items) {
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory) {
            await postProcessDir(itemPath);
        }
        else {
            if (['.tpl', '.css', '.php'].includes(path.parse(item.name).ext)) {
                const content = await fsPort.readFile(itemPath);
                const newContent = content.replaceAll('APP_BASE_URL', appBaseHref);
                await fsPort.writeFile(itemPath, newContent);
            }
        }
    }
}
async function createRuntimePhp() {
    const start = new Date().getTime();
    await fsPort.cp(pathes.srcRuntimePhpDir, pathes.distRuntimePhpDir);
    console.log(`🐘 runtime PHP (${new Date().getTime() - start}ms)`);
}
//# sourceMappingURL=build.command.js.map