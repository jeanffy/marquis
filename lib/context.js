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
exports.initContext = exports.CONFIG = exports.OUTDIR = exports.LIBDIR = exports.CACHEDIR = exports.PROJDIR = void 0;
const fs = require("fs/promises");
const path = require("path");
exports.PROJDIR = process.cwd();
exports.CACHEDIR = path.join(process.cwd(), '.marquis-cache');
exports.LIBDIR = __dirname;
exports.OUTDIR = '';
function initContext() {
    return __awaiter(this, void 0, void 0, function* () {
        const configPath = path.join(exports.PROJDIR, 'marquis.config.js');
        exports.CONFIG = yield Promise.resolve().then(() => require(configPath));
        yield fs.mkdir(exports.CACHEDIR, { recursive: true });
        exports.OUTDIR = path.join(exports.PROJDIR, (exports.CONFIG.outputDir !== undefined ? exports.CONFIG.outputDir : 'dist'));
    });
}
exports.initContext = initContext;
