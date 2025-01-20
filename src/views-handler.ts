import path from 'node:path';
import { FsPort } from './ports/fs.port.js';
import { CompileScssPort } from './ports/compile-scss.port.js';
import { CompileTsPort } from './ports/compile-ts.port.js';

/*
views/
	_components/
    foo.component.php
    foo.component.ts
    foo.component.tpl
    foo.component.scss
    bar/
      bar.component.php
      bar.component.ts
      bar.component.tpl
      bar.component.scss
  _index
    root.view.php
    root.view.ts
    root.view.tpl
    root.view.scss
	discography/
		_components
			bar.component.php
			bar.component.ts
			bar.component.tpl
			bar.component.scss
    _index
      discography.view.php
      discography.view.ts
      discography.view.tpl
      discography.view.scss
    unreal-seas/
			_components
				baz.component.php
				baz.component.ts
				baz.component.tpl
				baz.component.scss
      _index
        unreal-seas.view.php
        unreal-seas.view.ts
        unreal-seas.view.tpl
        unreal-seas.view.scss
*/

interface DirItems {
  // pathes are relative to srcBaseDirPath (and thus also relative to distBaseDirPath)

  phpRelativePath?: string;
  scssRelativePath?: string;
  tplRelativePath: string;
  tsRelativePath?: string;

  componentsDirRelativePath?: string;

  subDirsRelativePath: string[];
}

export class ViewsHandler {
  public constructor(
    private fsPort: FsPort,
    private compileScssPort: CompileScssPort,
    private compileTsPort: CompileTsPort,
    private srcBaseDirPath: string,
    private distBaseDirPath: string,
  ) {}

  public async handleDirectory(srcDirRelativePath: string): Promise<void> {
    const items = await this.getDirItems(srcDirRelativePath);

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

    for (const subDirRelativePath of items.subDirsRelativePath) {
      await this.handleDirectory(subDirRelativePath);
    }
  }

  private async getDirItems(srcDirRelativePath: string): Promise<DirItems> {
    const srcDirAbsolutePath = path.join(this.srcBaseDirPath, srcDirRelativePath);
    const srcDirName = path.basename(srcDirRelativePath);
    const viewName = srcDirName === '' ? 'root' : srcDirName;

    let dirItems = await this.fsPort.readdir(srcDirAbsolutePath);
    dirItems = dirItems.filter(i => i.name !== '_404');

    const componentsDirItem = dirItems.find(i => i.isDirectory && i.name === '_components');
    const indexDirItem = dirItems.find(i => i.isDirectory && i.name === '_index');
    const subDirs = dirItems.filter(i => i.isDirectory && i.name !== '_components' && i.name !== '_index');

    if (indexDirItem === undefined) {
      throw new Error(`no _index folder in '${srcDirAbsolutePath}'`);
    }

    const indexDirItems = await this.fsPort.readdir(indexDirItem.fullPath);

    const phpItem = indexDirItems.find(i => i.isFile && i.name === `${viewName}.view.php`);
    const scssItem = indexDirItems.find(i => i.isFile && i.name === `${viewName}.view.scss`);
    const tplItem = indexDirItems.find(i => i.isFile && i.name === `${viewName}.view.tpl`);
    const tsItem = indexDirItems.find(i => i.isFile && i.name === `${viewName}.view.ts`);

    if (tplItem === undefined) {
      throw new Error(`no ${viewName}.view.tpl in '${indexDirItem.fullPath}'`);
    }

    return {
      phpRelativePath: phpItem !== undefined ? path.join(srcDirRelativePath, '_index', phpItem.name) : undefined,
      scssRelativePath: scssItem !== undefined ? path.join(srcDirRelativePath, '_index', scssItem.name) : undefined,
      tplRelativePath: path.join(srcDirRelativePath, '_index', tplItem.name),
      tsRelativePath: tsItem !== undefined ? path.join(srcDirRelativePath, '_index', tsItem.name) : undefined,
      componentsDirRelativePath: componentsDirItem !== undefined ? path.join(srcDirRelativePath, componentsDirItem.name) : undefined,
      subDirsRelativePath: subDirs.map(d => path.join(srcDirRelativePath, d.name)),
    };
  }

  private async handleComponentsDir(dirRelativePath: string): Promise<void> {
    const srcDirAbsolutePath = path.join(this.srcBaseDirPath, dirRelativePath);
    const srcItems = await this.fsPort.readdir(srcDirAbsolutePath);
    for (const srcItem of srcItems) {
      if (srcItem.isFile) {
        if (srcItem.name.endsWith('.component.php') || srcItem.name.endsWith('.component.tpl')) {
          const distItemPath = path.join(this.distBaseDirPath, dirRelativePath, srcItem.name);
          await this.fsPort.mkdir(path.dirname(distItemPath));
          await this.fsPort.copyFile(srcItem.fullPath, distItemPath);
        }
      } else if (srcItem.isDirectory) {
        await this.handleComponentsDir(path.join(dirRelativePath, srcItem.name));
      }
    }
  }

  private async handleRoutePhp(phpRelativePath: string): Promise<void> {
    const srcPhpAbsolutePath = path.join(this.srcBaseDirPath, phpRelativePath);
    const distPhpAbsolutePath = path.join(this.distBaseDirPath, phpRelativePath);
    await this.fsPort.mkdir(path.dirname(distPhpAbsolutePath));
    await this.fsPort.copyFile(srcPhpAbsolutePath, distPhpAbsolutePath);
  }

  private async handleRouteScss(scssRelativePath: string): Promise<void> {
    const srcScssAbsolutePath = path.join(this.srcBaseDirPath, scssRelativePath);
    const distCssAbsolutePath = path.join(this.distBaseDirPath, scssRelativePath).replace('.scss', '.css');
    const cssContent = await this.compileScssPort.compile(srcScssAbsolutePath);
    await this.fsPort.mkdir(path.dirname(distCssAbsolutePath));
    await this.fsPort.writeFile(distCssAbsolutePath, cssContent);
  }

  private async handleRouteTpl(tplRelativePath: string): Promise<void> {
    const srcTplAbsolutePath = path.join(this.srcBaseDirPath, tplRelativePath);
    const distTplAbsolutePath = path.join(this.distBaseDirPath, tplRelativePath);
    await this.fsPort.mkdir(path.dirname(distTplAbsolutePath));
    await this.fsPort.copyFile(srcTplAbsolutePath, distTplAbsolutePath);
  }

  private async handleRouteTs(tsRelativePath: string): Promise<void> {
    const srcTsAbsolutePath = path.join(this.srcBaseDirPath, tsRelativePath);
    const distJsAbsolutePath = path.join(this.distBaseDirPath, tsRelativePath).replace('.ts', '.js');
    const jsContent = await this.compileTsPort.compile(srcTsAbsolutePath);
    await this.fsPort.mkdir(path.dirname(distJsAbsolutePath));
    await this.fsPort.writeFile(distJsAbsolutePath, jsContent);
  }
}
