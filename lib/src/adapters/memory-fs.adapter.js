import path from 'node:path';
export class MemoryFsAdapter {
    #files = new Map();
    log() {
        console.log(this.#files);
    }
    async fileExists(filePath) {
        const filePathNormalized = this.normalizePath(filePath);
        const item = this.#files.get(filePathNormalized);
        return item !== undefined && item.type === 'file';
    }
    async dirExists(dirPath) {
        const dirPathNormalized = this.normalizePath(dirPath);
        const item = this.#files.get(dirPathNormalized);
        return item !== undefined && item.type === 'dir';
    }
    async readdir(dirPath, options) {
        const dirPathNormalized = this.normalizePath(dirPath);
        const pathFragmentCount = this.getPathFragments(dirPathNormalized).length;
        const items = [];
        for (const file of this.#files.entries()) {
            if (file[0].startsWith(`${dirPathNormalized}/`)) {
                const item = file[1];
                if (options?.recursive === true) {
                    items.push(item);
                }
                else if (this.getPathFragments(item.itemPath).length === pathFragmentCount + 1) {
                    items.push(item);
                }
            }
        }
        return items.map(i => ({
            isFile: i.type === 'file',
            isDirectory: i.type === 'dir',
            fullPath: i.itemPath,
            parentPath: path.dirname(i.itemPath),
            name: path.basename(i.itemPath),
            ext: path.parse(i.itemPath).ext,
        }));
    }
    async mkdir(dirPath) {
        const dirPathNormalized = this.normalizePath(dirPath);
        if (this.#files.has(dirPathNormalized)) {
            return;
        }
        this.ensureParentDirectoriesExist(dirPathNormalized);
        this.#files.set(dirPathNormalized, {
            type: 'dir',
            itemPath: dirPathNormalized,
            content: '',
        });
    }
    async readFile(filePath) {
        const filePathNormalized = this.normalizePath(filePath);
        const item = this.#files.get(filePathNormalized);
        if (item === undefined) {
            throw new Error(`file not found '${filePathNormalized}'`);
        }
        if (item.type !== 'file') {
            throw new Error(`file at '${filePathNormalized}' is of type '${item.type}'`);
        }
        return item.content;
    }
    async writeFile(filePath, content) {
        const filePathNormalized = this.normalizePath(filePath);
        this.checkParentDirectoriesExist(filePathNormalized);
        let file = this.#files.get(filePathNormalized);
        if (file === undefined) {
            file = {
                type: 'file',
                itemPath: filePath,
                content: '',
            };
            this.#files.set(filePath, file);
        }
        file.content = content;
    }
    async copyFile(srcPath, distPath) {
        const srcPathNormalized = this.normalizePath(srcPath);
        const distPathNormalized = this.normalizePath(distPath);
        const srcItem = this.#files.get(srcPathNormalized);
        if (srcItem === undefined) {
            throw new Error(`file not found '${srcPathNormalized}'`);
        }
        this.checkParentDirectoriesExist(distPathNormalized);
        let distItem = this.#files.get(distPathNormalized);
        if (distItem !== undefined) {
            throw new Error(`destination already exists at '${distPathNormalized}' as a '${distItem.type}'`);
        }
        distItem = {
            type: 'file',
            itemPath: distPathNormalized,
            content: srcItem.content,
        };
        this.#files.set(distPathNormalized, distItem);
    }
    async rm(_dirPath) {
        throw new Error('not implemented');
    }
    async unlink(_filePath) {
        throw new Error('not implemented');
    }
    async cp(_srcDirPath, _distDirPath) {
        throw new Error('not implemented');
    }
    normalizePath(thePath) {
        return path.normalize(thePath);
    }
    checkParentDirectoriesExist(itemPathNormalized) {
        let fragments = this.getPathFragments(path.dirname(itemPathNormalized));
        let itemPath = '';
        for (const fragment of fragments) {
            itemPath += `/${fragment}`;
            const item = this.#files.get(itemPath);
            if (item === undefined) {
                throw new Error(`directory does not exist '${itemPath}'`);
            }
            if (item.type !== 'dir') {
                throw new Error(`item at '${itemPath}' is not a directory`);
            }
        }
    }
    ensureParentDirectoriesExist(itemPathNormalized) {
        let fragments = this.getPathFragments(path.dirname(itemPathNormalized));
        let itemPath = '';
        for (const fragment of fragments) {
            itemPath += `/${fragment}`;
            this.#files.set(itemPath, {
                type: 'dir',
                itemPath: itemPath,
                content: '',
            });
        }
    }
    getPathFragments(itemPath) {
        return itemPath.split('/').filter(f => f.length > 0);
    }
}
//# sourceMappingURL=memory-fs.adapter.js.map