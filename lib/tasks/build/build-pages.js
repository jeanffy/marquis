"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPages = void 0;
const fs = require("fs/promises");
const path = require("path");
const sass = require("sass");
const context_1 = require("../../context");
const helper_1 = require("../../helper");
function buildPages() {
    return __awaiter(this, void 0, void 0, function* () {
        const generatedPages = [];
        (0, helper_1.logAction)('Generating pages');
        yield fs.mkdir(path.join(context_1.OUTDIR, 'pages'), { recursive: true });
        if (context_1.CONFIG.styles !== undefined) {
            yield fs.mkdir(path.join(context_1.OUTDIR, 'styles'), { recursive: true });
        }
        if (context_1.CONFIG.scripts !== undefined) {
            yield fs.mkdir(path.join(context_1.OUTDIR, 'scripts'), { recursive: true });
        }
        const ext = (context_1.CONFIG.pages.ext !== undefined ? context_1.CONFIG.pages.ext : 'php');
        const stylesPlaceholder = '<!-- #marquis:styles -->';
        const scriptsPlaceholder = '<!-- #marquis:scripts -->';
        const folderPages = yield (0, helper_1.getFolderItems)(path.join(context_1.PROJDIR, context_1.CONFIG.pages.dir), context_1.CONFIG.pages.excludes);
        for (const page of folderPages) {
            let cssEnabled = false;
            if (context_1.CONFIG.styles !== undefined) {
                const stylesDir = (context_1.CONFIG.styles.dir !== undefined ? context_1.CONFIG.styles.dir : context_1.CONFIG.pages.dir);
                const scssPath = path.join(context_1.PROJDIR, stylesDir, `${page.name}.scss`);
                if (yield (0, helper_1.fileExists)(scssPath)) {
                    const fileParse = path.parse(scssPath);
                    const res = sass.compile(scssPath, { style: 'compressed' });
                    yield fs.writeFile(path.join(context_1.OUTDIR, 'styles', `${fileParse.name}.css`), res.css, { encoding: 'utf-8' });
                    cssEnabled = true;
                }
            }
            let jsEnabled = false;
            if (context_1.CONFIG.scripts !== undefined) {
                const tsConfigPath = yield (0, helper_1.exportTemplate)('tsconfig.json.twig', context_1.CACHEDIR, 'tsconfig.json', {
                    typeRoots: (context_1.CONFIG.scripts.typeRoots !== undefined ? context_1.CONFIG.scripts.typeRoots.map(tr => `"${tr}"`).join(',') : '')
                });
                const scriptsDir = (context_1.CONFIG.scripts.dir !== undefined ? context_1.CONFIG.scripts.dir : context_1.CONFIG.pages.dir);
                const tsPath = path.join(context_1.PROJDIR, scriptsDir, `${page.name}.ts`);
                if (yield (0, helper_1.fileExists)(tsPath)) {
                    const fileParse = path.parse(tsPath);
                    const webpackConfigPath = yield (0, helper_1.exportTemplate)('webpack.config.js.twig', context_1.CACHEDIR, 'webpack.config.js', {
                        entryPath: tsPath,
                        outBundleDir: path.join(context_1.OUTDIR, 'scripts'),
                        outBundleName: `${fileParse.name}.js`,
                        tsConfigPath: tsConfigPath
                    });
                    yield (0, helper_1.promiseSpawn)(`npx webpack -c '${webpackConfigPath}'`, {
                        shell: true,
                        stdio: 'inherit',
                    });
                    jsEnabled = true;
                }
            }
            const processFunc = (content) => {
                if (cssEnabled) {
                    content = content.replace(stylesPlaceholder, `<link rel="stylesheet" href="../styles/${page.name}.css">`);
                }
                else {
                    content = content.replace(stylesPlaceholder, '');
                }
                if (jsEnabled) {
                    content = content.replace(scriptsPlaceholder, `<script src="../scripts/${page.name}.js"></script>`);
                }
                else {
                    content = content.replace(scriptsPlaceholder, '');
                }
                return content;
            };
            const generatedPath = path.join(context_1.OUTDIR, 'pages', `${page.name}.${ext}`);
            switch (page.pageType) {
                case 'twig': {
                    yield (0, helper_1.callTwig)(page.filePath, generatedPath, processFunc);
                    break;
                }
                case 'php':
                case 'html': {
                    let content = yield fs.readFile(page.filePath, { encoding: 'utf-8' });
                    content = processFunc(content);
                    yield fs.writeFile(generatedPath, content, { encoding: 'utf-8' });
                    break;
                }
            }
            generatedPages.push({
                name: page.name,
                filePath: generatedPath
            });
            (0, helper_1.logActionProgress)(`Emitted '${page.name}'`);
        }
        return generatedPages;
    });
}
exports.buildPages = buildPages;
