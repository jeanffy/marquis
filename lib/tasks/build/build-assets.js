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
exports.buildAssets = void 0;
const fs = require("fs/promises");
const ncp = require("ncp");
const path = require("path");
const util = require("util");
const context_1 = require("../../context");
const helper_1 = require("../../helper");
const ncpPromise = util.promisify(ncp);
function buildAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        if (context_1.CONFIG.assets === undefined) {
            return;
        }
        (0, helper_1.logAction)('Copying assets');
        const assetsFolderName = path.parse(context_1.CONFIG.assets.dir).base;
        yield fs.mkdir(path.join(context_1.OUTDIR, assetsFolderName), { recursive: true });
        yield ncpPromise(path.join(context_1.PROJDIR, context_1.CONFIG.assets.dir), path.join(context_1.OUTDIR, assetsFolderName));
    });
}
exports.buildAssets = buildAssets;
