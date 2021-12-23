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
const console_colors_1 = require("../../console.colors");
const build_additional_files_1 = require("./build-additional-files");
const build_assets_1 = require("./build-assets");
const build_htaccess_1 = require("./build-htaccess");
const build_indexphp_1 = require("./build-indexphp");
const build_init_1 = require("./build-init");
const build_pages_1 = require("./build-pages");
const cache_1 = require("./cache");
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        const start = new Date();
        const cache = yield (0, cache_1.readCacheFile)();
        yield (0, build_init_1.buildInit)();
        const buildPagesResult = yield (0, build_pages_1.buildPages)(cache);
        yield (0, build_assets_1.buildAssets)();
        yield (0, build_additional_files_1.buildAdditionalFiles)();
        yield (0, build_htaccess_1.buildHtaccess)(buildPagesResult.generatedPages);
        yield (0, build_indexphp_1.buildIndexPhp)(buildPagesResult.generatedPages);
        yield (0, cache_1.writeCacheFile)(buildPagesResult.updatedCache);
        console.info(console_colors_1.ConsoleColors.notice(`Build execution time: ${new Date().getTime() - start.getTime()} ms`));
    });
}
exports.build = build;
