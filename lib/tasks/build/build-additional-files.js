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
exports.buildAdditionalFiles = void 0;
const fs = require("fs/promises");
const path = require("path");
const context_1 = require("../../context");
const helper_1 = require("../../helper");
function buildAdditionalFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        if (context_1.CONFIG.additionalFiles === undefined) {
            return;
        }
        (0, helper_1.logAction)('Copying additional files');
        for (const additionalFile of context_1.CONFIG.additionalFiles) {
            let src;
            let dst;
            if (typeof additionalFile === 'string') {
                src = additionalFile;
                dst = '';
            }
            else {
                src = additionalFile.src;
                dst = additionalFile.dst;
            }
            const fileName = path.parse(src);
            yield fs.copyFile(path.join(context_1.PROJDIR, src), path.join(context_1.OUTDIR, dst, fileName.base));
            (0, helper_1.logActionProgress)(`Emitted '${fileName.base}'`);
        }
    });
}
exports.buildAdditionalFiles = buildAdditionalFiles;
