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
exports.fileHasNotChanged = exports.writeCacheFile = exports.readCacheFile = void 0;
const fs = require("fs/promises");
const path = require("path");
const context_1 = require("../../context");
const helper_1 = require("../../helper");
function readCacheFile() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const cacheFilePath = path.join(context_1.CACHEDIR, 'data.json');
        let cacheFileContent = {
            pages: []
        };
        if (((_a = context_1.CONFIG.cache) === null || _a === void 0 ? void 0 : _a.enabled) === false) {
            return cacheFileContent;
        }
        if (yield (0, helper_1.fileExists)(cacheFilePath)) {
            cacheFileContent = JSON.parse(yield fs.readFile(cacheFilePath, { encoding: 'utf-8' }));
        }
        return cacheFileContent;
    });
}
exports.readCacheFile = readCacheFile;
function writeCacheFile(cache) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = context_1.CONFIG.cache) === null || _a === void 0 ? void 0 : _a.enabled) === false) {
            return;
        }
        const cacheFilePath = path.join(context_1.CACHEDIR, 'data.json');
        yield fs.writeFile(cacheFilePath, JSON.stringify(cache, undefined, 2), { encoding: 'utf-8' });
    });
}
exports.writeCacheFile = writeCacheFile;
function fileHasNotChanged(cache, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const mtime = yield (0, helper_1.fileModifiedAt)(filePath);
        const cachePage = cache.pages.find(p => p.path === filePath);
        const fileHasChanged = (cachePage === undefined || cachePage.lastModifiedAt !== mtime.toISOString());
        if (fileHasChanged) {
            if (cachePage !== undefined) {
                cachePage.lastModifiedAt = mtime.toISOString();
            }
            else {
                cache.pages.push({
                    path: filePath,
                    lastModifiedAt: mtime.toISOString()
                });
            }
        }
        return !fileHasChanged;
    });
}
exports.fileHasNotChanged = fileHasNotChanged;
