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
exports.serve = void 0;
const fs = require("fs/promises");
const path = require("path");
const context_1 = require("../context");
const helper_1 = require("../helper");
function serve() {
    return __awaiter(this, void 0, void 0, function* () {
        const userPackageJsonPath = path.join(context_1.PROJDIR, 'package.json');
        const userPackageJsonContent = JSON.parse(yield fs.readFile(userPackageJsonPath, { encoding: 'utf-8' }));
        const dockerShPath = yield (0, helper_1.exportTemplate)('docker.sh.twig', context_1.CACHEDIR, 'docker.sh', {
            containerName: userPackageJsonContent.name,
            htmlFolder: context_1.OUTDIR
        });
        yield (0, helper_1.promiseSpawn)(`sh ${dockerShPath}`, {
            shell: true,
            stdio: 'inherit',
        });
        console.log(`Open your browser on http://localhost:8900`);
    });
}
exports.serve = serve;
