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
exports.buildIndexPhp = void 0;
const context_1 = require("../../context");
const helper_1 = require("../../helper");
function buildIndexPhp(pages) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, helper_1.logAction)('Generating index.php');
        yield (0, helper_1.exportTemplate)('index.php.twig', context_1.OUTDIR, 'index.php', {
            defaultPage: context_1.CONFIG.pages.default,
            pages: pages.map(p => p.name)
        });
        (0, helper_1.logActionProgress)('Emitted index.php');
    });
}
exports.buildIndexPhp = buildIndexPhp;
