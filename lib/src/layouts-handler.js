import path from 'node:path';
export class LayoutsHandler {
    fsPort;
    compileScssPort;
    compileTsPort;
    srcBaseDirPath;
    distBaseDirPath;
    constructor(fsPort, compileScssPort, compileTsPort, srcBaseDirPath, distBaseDirPath) {
        this.fsPort = fsPort;
        this.compileScssPort = compileScssPort;
        this.compileTsPort = compileTsPort;
        this.srcBaseDirPath = srcBaseDirPath;
        this.distBaseDirPath = distBaseDirPath;
    }
    async handleDirectory(srcDirRelativePath) {
        const srcDirAbsolutePath = path.join(this.srcBaseDirPath);
        let layoutItems = await this.fsPort.readdir(srcDirAbsolutePath);
        for (const layoutItem of layoutItems) {
            if (layoutItem.isDirectory) {
                const srcLayoutRelativePath = path.join(srcDirRelativePath, layoutItem.name);
                await this.handleLayout(srcLayoutRelativePath);
            }
        }
    }
    async handleLayout(srcLayoutDirRelativePath) {
        const items = await this.getDirItems(srcLayoutDirRelativePath);
        if (items.componentsDirRelativePath !== undefined) {
            await this.handleComponentsDir(items.componentsDirRelativePath);
        }
        if (items.phpRelativePath !== undefined) {
            await this.handleRoutePhp(items.phpRelativePath);
        }
        if (items.scssRelativePath !== undefined) {
            await this.handleRouteScss(items.scssRelativePath);
        }
        await this.handleRouteTpl(items.tplRelativePath);
        if (items.tsRelativePath !== undefined) {
            await this.handleRouteTs(items.tsRelativePath);
        }
    }
    async getDirItems(srcDirRelativePath) {
        const srcDirAbsolutePath = path.join(this.srcBaseDirPath, srcDirRelativePath);
        const layoutName = path.basename(srcDirRelativePath);
        const dirItems = await this.fsPort.readdir(srcDirAbsolutePath);
        const componentsDirItem = dirItems.find(i => i.isDirectory && i.name === '_components');
        const phpItem = dirItems.find(i => i.isFile && i.name === `${layoutName}.layout.php`);
        const scssItem = dirItems.find(i => i.isFile && i.name === `${layoutName}.layout.scss`);
        const tplItem = dirItems.find(i => i.isFile && i.name === `${layoutName}.layout.tpl`);
        const tsItem = dirItems.find(i => i.isFile && i.name === `${layoutName}.layout.ts`);
        if (tplItem === undefined) {
            throw new Error(`no ${layoutName}.layout.tpl in '${srcDirAbsolutePath}'`);
        }
        return {
            phpRelativePath: phpItem !== undefined ? path.join(srcDirRelativePath, phpItem.name) : undefined,
            scssRelativePath: scssItem !== undefined ? path.join(srcDirRelativePath, scssItem.name) : undefined,
            tplRelativePath: path.join(srcDirRelativePath, tplItem.name),
            tsRelativePath: tsItem !== undefined ? path.join(srcDirRelativePath, tsItem.name) : undefined,
            componentsDirRelativePath: componentsDirItem !== undefined ? path.join(srcDirRelativePath, componentsDirItem.name) : undefined,
        };
    }
    async handleComponentsDir(dirRelativePath) {
        const srcDirAbsolutePath = path.join(this.srcBaseDirPath, dirRelativePath);
        const srcItems = await this.fsPort.readdir(srcDirAbsolutePath);
        for (const srcItem of srcItems) {
            if (srcItem.isFile) {
                if (srcItem.name.endsWith('.component.php') || srcItem.name.endsWith('.component.tpl')) {
                    const distItemPath = path.join(this.distBaseDirPath, dirRelativePath, srcItem.name);
                    await this.fsPort.mkdir(path.dirname(distItemPath));
                    await this.fsPort.copyFile(srcItem.fullPath, distItemPath);
                }
            }
            else if (srcItem.isDirectory) {
                await this.handleComponentsDir(path.join(dirRelativePath, srcItem.name));
            }
        }
    }
    async handleRoutePhp(phpRelativePath) {
        const srcPhpAbsolutePath = path.join(this.srcBaseDirPath, phpRelativePath);
        const distPhpAbsolutePath = path.join(this.distBaseDirPath, phpRelativePath);
        await this.fsPort.mkdir(path.dirname(distPhpAbsolutePath));
        await this.fsPort.copyFile(srcPhpAbsolutePath, distPhpAbsolutePath);
    }
    async handleRouteScss(scssRelativePath) {
        const srcScssAbsolutePath = path.join(this.srcBaseDirPath, scssRelativePath);
        const distCssAbsolutePath = path.join(this.distBaseDirPath, scssRelativePath).replace('.scss', '.css');
        const cssContent = await this.compileScssPort.compile(srcScssAbsolutePath);
        await this.fsPort.mkdir(path.dirname(distCssAbsolutePath));
        await this.fsPort.writeFile(distCssAbsolutePath, cssContent);
    }
    async handleRouteTpl(tplRelativePath) {
        const srcTplAbsolutePath = path.join(this.srcBaseDirPath, tplRelativePath);
        const distTplAbsolutePath = path.join(this.distBaseDirPath, tplRelativePath);
        await this.fsPort.mkdir(path.dirname(distTplAbsolutePath));
        await this.fsPort.copyFile(srcTplAbsolutePath, distTplAbsolutePath);
    }
    async handleRouteTs(tsRelativePath) {
        const srcTsAbsolutePath = path.join(this.srcBaseDirPath, tsRelativePath);
        const distJsAbsolutePath = path.join(this.distBaseDirPath, tsRelativePath).replace('.ts', '.js');
        const jsContent = await this.compileTsPort.compile(srcTsAbsolutePath);
        await this.fsPort.mkdir(path.dirname(distJsAbsolutePath));
        await this.fsPort.writeFile(distJsAbsolutePath, jsContent);
    }
}
//# sourceMappingURL=layouts-handler.js.map