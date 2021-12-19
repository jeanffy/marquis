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
exports.build = void 0;
const build_additional_files_1 = require("./build-additional-files");
const build_assets_1 = require("./build-assets");
const build_htaccess_1 = require("./build-htaccess");
const build_indexphp_1 = require("./build-indexphp");
const build_init_1 = require("./build-init");
const build_pages_1 = require("./build-pages");
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, build_init_1.buildInit)();
        const pages = yield (0, build_pages_1.buildPages)();
        yield (0, build_assets_1.buildAssets)();
        yield (0, build_additional_files_1.buildAdditionalFiles)();
        yield (0, build_htaccess_1.buildHtaccess)(pages);
        yield (0, build_indexphp_1.buildIndexPhp)(pages);
    });
}
exports.build = build;
