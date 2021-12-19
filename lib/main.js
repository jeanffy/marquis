#! /usr/bin/env node
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
const tasks_1 = require("./tasks");
const context_1 = require("./context");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (args.length === 0) {
                console.log('Usage: marquis <command>');
                return;
            }
            yield (0, context_1.initContext)();
            const command = args[0];
            switch (command) {
                case 'build':
                    yield (0, tasks_1.build)();
                    break;
                case 'watch':
                    yield (0, tasks_1.watch)();
                    break;
                case 'serve':
                    yield (0, tasks_1.serve)();
                    break;
                case 'clean':
                    yield (0, tasks_1.clean)();
                    break;
                default: throw new Error(`Unknown command '${command}'`);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
        }
    });
}
main(process.argv.slice(2));
