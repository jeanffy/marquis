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
exports.fileModifiedAt = exports.fileAppend = exports.getFolderItems = exports.exportTemplate = exports.callTwig = exports.fileExists = exports.promiseSpawn = exports.twigRenderFilePromise = exports.logActionProgress = exports.logAction = void 0;
const child_process_1 = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const twig = require("twig");
const context_1 = require("./context");
const console_colors_1 = require("./console.colors");
let actionId = 1;
function logAction(message) {
    console.log(console_colors_1.ConsoleColors.info(`[${String(actionId).padStart(2, '0')}] ${message}`));
    actionId++;
}
exports.logAction = logAction;
function logActionProgress(message, notImportant = false) {
    if (notImportant) {
        console.log(console_colors_1.ConsoleColors.notice(`     ${message}`));
    }
    else {
        console.log(console_colors_1.ConsoleColors.success(`     ${message}`));
    }
}
exports.logActionProgress = logActionProgress;
function twigRenderFilePromise(templatePath, options) {
    return new Promise((resolve, reject) => {
        twig.renderFile(templatePath, options, (error, html) => {
            if (error) {
                return reject(error);
            }
            return resolve(html);
        });
    });
}
exports.twigRenderFilePromise = twigRenderFilePromise;
function promiseSpawn(command, options) {
    return new Promise((resolve, reject) => {
        const process = (0, child_process_1.spawn)(command, options);
        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command ${command} exited with code ${code}`));
            }
            resolve();
        });
        process.on('error', (err) => {
            reject(err);
        });
    });
}
exports.promiseSpawn = promiseSpawn;
function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stat = yield fs.stat(filePath);
            return stat.isFile();
        }
        catch (error) {
            const prop = 'code';
            if (Object.prototype.hasOwnProperty.call(error, prop) && error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    });
}
exports.fileExists = fileExists;
function callTwig(twigPath, outputPath, processFunc, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let generatedContent = yield twigRenderFilePromise(twigPath, params || {});
        if (processFunc !== undefined) {
            generatedContent = processFunc(generatedContent);
        }
        yield fs.writeFile(outputPath, generatedContent, { encoding: 'utf-8' });
        return outputPath;
    });
}
exports.callTwig = callTwig;
function exportTemplate(tplName, outputFolder, fileName, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const tplPath = path.join(context_1.LIBDIR, 'templates', tplName);
        const generatedPath = path.join(outputFolder, fileName);
        return callTwig(tplPath, generatedPath, undefined, params);
    });
}
exports.exportTemplate = exportTemplate;
function getFolderItems(folderPath, excludes) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield fs.readdir(folderPath, { withFileTypes: true }))
            .filter(d => {
            if (excludes !== undefined && excludes.includes(d.name)) {
                return false;
            }
            if (d.isDirectory()) {
                return false;
            }
            return ['.twig', '.php', '.html'].includes(path.parse(d.name).ext);
        })
            .map(d => {
            const parsed = path.parse(d.name);
            const filePath = path.join(folderPath, d.name);
            switch (parsed.ext) {
                case '.twig': return { pageType: 'twig', name: parsed.name, filePath: filePath };
                case '.php': return { pageType: 'php', name: parsed.name, filePath: filePath };
                case '.html': return { pageType: 'html', name: parsed.name, filePath: filePath };
                default: throw new Error('Internal error 1');
            }
        });
    });
}
exports.getFolderItems = getFolderItems;
function fileAppend(filePath, toAppend) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs.readFile(filePath, { encoding: 'utf-8' });
        yield fs.writeFile(filePath, `${content}${toAppend}`);
    });
}
exports.fileAppend = fileAppend;
function fileModifiedAt(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const stat = yield fs.stat(filePath);
        return stat.mtime;
    });
}
exports.fileModifiedAt = fileModifiedAt;
