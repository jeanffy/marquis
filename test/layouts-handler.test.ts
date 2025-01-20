import { FakeCompileScssAdapter } from '../src/adapters/fake-compile-scss.adapter.js';
import { FakeCompileTsAdapter } from '../src/adapters/fake-compile-ts.adapter.js';
import { MemoryFsAdapter } from '../src/adapters/memory-fs.adapter.js';
import { LayoutsHandler } from '../src/layouts-handler.js';

describe('layouts-handler', () => {
  let fsPort: MemoryFsAdapter;
  let compileScssPort: FakeCompileScssAdapter;
  let compileTsPort: FakeCompileTsAdapter;

  beforeEach(() => {
    fsPort = new MemoryFsAdapter();
    compileScssPort = new FakeCompileScssAdapter(fsPort);
    compileTsPort = new FakeCompileTsAdapter(fsPort);
  });

  test('with only tpl', async (): Promise<void> => {
    await fsPort.mkdir('/code');
    await fsPort.mkdir('/code/layouts');
    await fsPort.mkdir('/code/layouts/main');
    await fsPort.writeFile('/code/layouts/main/main.layout.tpl', 'main.layout.tpl');
    await fsPort.mkdir('/dist/layouts');
    const handler = new LayoutsHandler(fsPort, compileScssPort, compileTsPort, '/code/layouts', '/dist/layouts');
    await handler.handleDirectory('');
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.php')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.scss')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.css')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.tpl')).toEqual(true);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.ts')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.js')).toEqual(false);
    expect(await fsPort.readFile('/dist/layouts/main/main.layout.tpl')).toEqual('main.layout.tpl');
  });

  test('with all files', async (): Promise<void> => {
    await fsPort.mkdir('/code');
    await fsPort.mkdir('/code/layouts');
    await fsPort.mkdir('/code/layouts/main');
    await fsPort.writeFile('/code/layouts/main/main.layout.php', 'main.layout.php');
    await fsPort.writeFile('/code/layouts/main/main.layout.scss', 'main.layout.scss');
    await fsPort.writeFile('/code/layouts/main/main.layout.tpl', 'main.layout.tpl');
    await fsPort.writeFile('/code/layouts/main/main.layout.ts', 'main.layout.ts');
    await fsPort.mkdir('/dist/layouts');
    const handler = new LayoutsHandler(fsPort, compileScssPort, compileTsPort, '/code/layouts', '/dist/layouts');
    await handler.handleDirectory('');
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.php')).toEqual(true);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.scss')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.css')).toEqual(true);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.tpl')).toEqual(true);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.ts')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/main.layout.js')).toEqual(true);
    expect(await fsPort.readFile('/dist/layouts/main/main.layout.php')).toEqual('main.layout.php');
    expect(await fsPort.readFile('/dist/layouts/main/main.layout.css')).toEqual('main.layout.scss');
    expect(await fsPort.readFile('/dist/layouts/main/main.layout.tpl')).toEqual('main.layout.tpl');
    expect(await fsPort.readFile('/dist/layouts/main/main.layout.js')).toEqual('main.layout.ts');
  });

  test('with components', async (): Promise<void> => {
    await fsPort.mkdir('/code');
    await fsPort.mkdir('/code/layouts');
    await fsPort.mkdir('/code/layouts/main');
    await fsPort.writeFile('/code/layouts/main/main.layout.tpl', 'main.layout.tpl');

    await fsPort.mkdir('/code/layouts/main/_components');
    await fsPort.writeFile('/code/layouts/main/_components/bar.component.php', 'bar.component.php');
    await fsPort.writeFile('/code/layouts/main/_components/bar.component.scss', 'bar.component.scss');
    await fsPort.writeFile('/code/layouts/main/_components/bar.component.tpl', 'bar.component.tpl');
    await fsPort.writeFile('/code/layouts/main/_components/bar.component.ts', 'bar.component.ts');
    await fsPort.mkdir('/code/layouts/main/_components/foo');
    await fsPort.writeFile('/code/layouts/main/_components/foo/foo.component.php', 'foo.component.php');
    await fsPort.writeFile('/code/layouts/main/_components/foo/foo.component.scss', 'foo.component.scss');
    await fsPort.writeFile('/code/layouts/main/_components/foo/foo.component.tpl', 'foo.component.tpl');
    await fsPort.writeFile('/code/layouts/main/_components/foo/foo.component.ts', 'foo.component.ts');

    await fsPort.mkdir('/dist/layouts');

    const handler = new LayoutsHandler(fsPort, compileScssPort, compileTsPort, '/code/layouts', '/dist/layouts');
    await handler.handleDirectory('');

    expect(await fsPort.dirExists('/dist/layouts/main/_components/foo')).toEqual(true);

    expect(await fsPort.fileExists('/dist/layouts/main/_components/bar.component.php')).toEqual(true);
    expect(await fsPort.readFile('/dist/layouts/main/_components/bar.component.php')).toEqual('bar.component.php');
    expect(await fsPort.fileExists('/dist/layouts/main/_components/bar.component.tpl')).toEqual(true);
    expect(await fsPort.readFile('/dist/layouts/main/_components/bar.component.tpl')).toEqual('bar.component.tpl');
    expect(await fsPort.fileExists('/dist/layouts/main/_components/bar.component.scss')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/_components/bar.component.css')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/_components/bar.component.ts')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/_components/bar.component.js')).toEqual(false);

    expect(await fsPort.fileExists('/dist/layouts/main/_components/foo/foo.component.php')).toEqual(true);
    expect(await fsPort.readFile('/dist/layouts/main/_components/foo/foo.component.php')).toEqual('foo.component.php');
    expect(await fsPort.fileExists('/dist/layouts/main/_components/foo/foo.component.tpl')).toEqual(true);
    expect(await fsPort.readFile('/dist/layouts/main/_components/foo/foo.component.tpl')).toEqual('foo.component.tpl');
    expect(await fsPort.fileExists('/dist/layouts/main/_components/foo/foo.component.scss')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/_components/foo/foo.component.css')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/_components/foo/foo.component.ts')).toEqual(false);
    expect(await fsPort.fileExists('/dist/layouts/main/_components/foo/foo.component.js')).toEqual(false);
  });
});
