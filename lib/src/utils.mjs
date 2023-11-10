import { exec, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import util from 'node:util';
import * as sass from 'sass';
import twig from 'twig';
import { ConsoleColors } from './console-colors.mjs';
export async function fileExists(filePath) {
    try {
        const stat = await fs.stat(filePath);
        return stat.isFile();
    }
    catch (error) {
        const prop = 'code';
        if (Object.prototype.hasOwnProperty.call(error, prop) && error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}
export async function directoryExists(dirPath) {
    try {
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
    }
    catch (error) {
        const prop = 'code';
        if (Object.prototype.hasOwnProperty.call(error, prop) && error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}
export async function emptyDirectory(dirPath) {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    for (const item of items) {
        const itemPath = path.join(item.path, item.name);
        if (item.isFile() || item.isDirectory()) {
            await fs.rm(itemPath, { recursive: true, force: true });
        }
        else {
            ConsoleColors.warning(`${itemPath} cannot be removed`);
        }
    }
}
export function twigRenderFilePromise(templatePath, options) {
    twig.cache(false);
    return new Promise((resolve, reject) => {
        twig.renderFile(templatePath, options, (error, html) => {
            if (error !== undefined && error !== null) {
                return reject(error);
            }
            return resolve(html);
        });
    });
}
export async function execWithCapture(command, options) {
    const execOptions = {};
    if (options?.shell !== undefined) {
        execOptions.shell = options.shell;
    }
    const promiseExec = util.promisify(exec);
    const { stdout, stderr } = await promiseExec(command, execOptions);
    return {
        stdout: stdout,
        stderr: stderr
    };
}
export async function execWithoutCapture(command, options) {
    const spawnOptions = {
        shell: true,
        stdio: 'inherit'
    };
    if (options?.shell !== undefined) {
        spawnOptions.shell = options?.shell;
    }
    return new Promise((resolve, reject) => {
        const process = spawn(command, spawnOptions);
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
export async function compileScss(inputPath) {
    const scssContent = await fs.readFile(inputPath, { encoding: 'utf-8' });
    const res = sass.compileString(scssContent, {
        style: 'compressed',
        importers: [
            {
                findFileUrl(url) {
                    const styleDir = path.parse(inputPath).dir;
                    const urlResolved = path.resolve(path.join(styleDir, url));
                    return new URL(pathToFileURL(urlResolved));
                }
            }
        ]
    });
    return res.css;
}
//# sourceMappingURL=utils.mjs.map