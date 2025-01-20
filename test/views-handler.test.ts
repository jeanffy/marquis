import { FakeCompileScssAdapter } from '../src/adapters/fake-compile-scss.adapter.js';
import { FakeCompileTsAdapter } from '../src/adapters/fake-compile-ts.adapter.js';
import { MemoryFsAdapter } from '../src/adapters/memory-fs.adapter.js';
import { ViewsHandler } from '../src/views-handler.js';

describe('views-handler', () => {
  let fsPort: MemoryFsAdapter;
  let compileScssPort: FakeCompileScssAdapter;
  let compileTsPort: FakeCompileTsAdapter;

  beforeEach(() => {
    fsPort = new MemoryFsAdapter();
    compileScssPort = new FakeCompileScssAdapter(fsPort);
    compileTsPort = new FakeCompileTsAdapter(fsPort);
  });

  describe('root view', () => {
    test('with only tpl', async (): Promise<void> => {
      await fsPort.mkdir('/code');
      await fsPort.mkdir('/code/views');
      await fsPort.mkdir('/code/views/_index');
      await fsPort.writeFile('/code/views/_index/root.view.tpl', 'root.view.tpl');
      await fsPort.mkdir('/dist/views');
      const handler = new ViewsHandler(fsPort, compileScssPort, compileTsPort, '/code/views', '/dist/views');
      await handler.handleDirectory('');
      expect(await fsPort.fileExists('/dist/views/_index/root.view.php')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.scss')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.css')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.tpl')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.ts')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.js')).toEqual(false);
      expect(await fsPort.readFile('/dist/views/_index/root.view.tpl')).toEqual('root.view.tpl');
    });

    test('with all files', async (): Promise<void> => {
      await fsPort.mkdir('/code');
      await fsPort.mkdir('/code/views');
      await fsPort.mkdir('/code/views/_index');
      await fsPort.writeFile('/code/views/_index/root.view.php', 'root.view.php');
      await fsPort.writeFile('/code/views/_index/root.view.scss', 'root.view.scss');
      await fsPort.writeFile('/code/views/_index/root.view.tpl', 'root.view.tpl');
      await fsPort.writeFile('/code/views/_index/root.view.ts', 'root.view.ts');
      await fsPort.mkdir('/dist/views');
      const handler = new ViewsHandler(fsPort, compileScssPort, compileTsPort, '/code/views', '/dist/views');
      await handler.handleDirectory('');
      expect(await fsPort.fileExists('/dist/views/_index/root.view.php')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.scss')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.css')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.tpl')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.ts')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_index/root.view.js')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/_index/root.view.php')).toEqual('root.view.php');
      expect(await fsPort.readFile('/dist/views/_index/root.view.css')).toEqual('root.view.scss');
      expect(await fsPort.readFile('/dist/views/_index/root.view.tpl')).toEqual('root.view.tpl');
      expect(await fsPort.readFile('/dist/views/_index/root.view.js')).toEqual('root.view.ts');
    });

    test('with components', async (): Promise<void> => {
      await fsPort.mkdir('/code');
      await fsPort.mkdir('/code/views');
      await fsPort.mkdir('/code/views/_index');
      await fsPort.writeFile('/code/views/_index/root.view.tpl', 'root.view.tpl');

      await fsPort.mkdir('/code/views/_components');
      await fsPort.writeFile('/code/views/_components/bar.component.php', 'bar.component.php');
      await fsPort.writeFile('/code/views/_components/bar.component.scss', 'bar.component.scss');
      await fsPort.writeFile('/code/views/_components/bar.component.tpl', 'bar.component.tpl');
      await fsPort.writeFile('/code/views/_components/bar.component.ts', 'bar.component.ts');
      await fsPort.mkdir('/code/views/_components/foo');
      await fsPort.writeFile('/code/views/_components/foo/foo.component.php', 'foo.component.php');
      await fsPort.writeFile('/code/views/_components/foo/foo.component.scss', 'foo.component.scss');
      await fsPort.writeFile('/code/views/_components/foo/foo.component.tpl', 'foo.component.tpl');
      await fsPort.writeFile('/code/views/_components/foo/foo.component.ts', 'foo.component.ts');

      await fsPort.mkdir('/dist/views');

      const handler = new ViewsHandler(fsPort, compileScssPort, compileTsPort, '/code/views', '/dist/views');
      await handler.handleDirectory('');

      expect(await fsPort.dirExists('/dist/views/_components/foo')).toEqual(true);

      expect(await fsPort.fileExists('/dist/views/_components/bar.component.php')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/_components/bar.component.php')).toEqual('bar.component.php');
      expect(await fsPort.fileExists('/dist/views/_components/bar.component.tpl')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/_components/bar.component.tpl')).toEqual('bar.component.tpl');
      expect(await fsPort.fileExists('/dist/views/_components/bar.component.scss')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_components/bar.component.css')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_components/bar.component.ts')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_components/bar.component.js')).toEqual(false);

      expect(await fsPort.fileExists('/dist/views/_components/foo/foo.component.php')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/_components/foo/foo.component.php')).toEqual('foo.component.php');
      expect(await fsPort.fileExists('/dist/views/_components/foo/foo.component.tpl')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/_components/foo/foo.component.tpl')).toEqual('foo.component.tpl');
      expect(await fsPort.fileExists('/dist/views/_components/foo/foo.component.scss')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_components/foo/foo.component.css')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_components/foo/foo.component.ts')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/_components/foo/foo.component.js')).toEqual(false);
    });
  });

  describe('view', () => {
    test('with page', async (): Promise<void> => {
      await fsPort.mkdir('/code');
      await fsPort.mkdir('/code/views');
      await fsPort.mkdir('/code/views/_index');
      await fsPort.writeFile('/code/views/_index/root.view.tpl', 'root.view.tpl');

      await fsPort.mkdir('/code/views/page/_index');
      await fsPort.writeFile('/code/views/page/_index/page.view.php', 'page.view.php');
      await fsPort.writeFile('/code/views/page/_index/page.view.scss', 'page.view.scss');
      await fsPort.writeFile('/code/views/page/_index/page.view.tpl', 'page.view.tpl');
      await fsPort.writeFile('/code/views/page/_index/page.view.ts', 'page.view.ts');

      await fsPort.mkdir('/dist/views');

      const handler = new ViewsHandler(fsPort, compileScssPort, compileTsPort, '/code/views', '/dist/views');
      await handler.handleDirectory('');

      expect(await fsPort.fileExists('/dist/views/page/_index/page.view.php')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/page/_index/page.view.scss')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/page/_index/page.view.css')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/page/_index/page.view.tpl')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/page/_index/page.view.ts')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/page/_index/page.view.js')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/page/_index/page.view.php')).toEqual('page.view.php');
      expect(await fsPort.readFile('/dist/views/page/_index/page.view.css')).toEqual('page.view.scss');
      expect(await fsPort.readFile('/dist/views/page/_index/page.view.tpl')).toEqual('page.view.tpl');
      expect(await fsPort.readFile('/dist/views/page/_index/page.view.js')).toEqual('page.view.ts');
    });
  });

  describe('sub-view', () => {
    test('with sub-page', async (): Promise<void> => {
      await fsPort.mkdir('/code');
      await fsPort.mkdir('/code/views');
      await fsPort.mkdir('/code/views/_index');
      await fsPort.writeFile('/code/views/_index/root.view.tpl', 'root.view.tpl');

      await fsPort.mkdir('/code/views/page/_index');
      await fsPort.writeFile('/code/views/page/_index/page.view.tpl', 'page.view.tpl');

      await fsPort.mkdir('/code/views/page/sub-page/_index');
      await fsPort.writeFile('/code/views/page/sub-page/_index/sub-page.view.php', 'sub-page.view.php');
      await fsPort.writeFile('/code/views/page/sub-page/_index/sub-page.view.scss', 'sub-page.view.scss');
      await fsPort.writeFile('/code/views/page/sub-page/_index/sub-page.view.tpl', 'sub-page.view.tpl');
      await fsPort.writeFile('/code/views/page/sub-page/_index/sub-page.view.ts', 'sub-page.view.ts');

      await fsPort.mkdir('/dist/views');

      const handler = new ViewsHandler(fsPort, compileScssPort, compileTsPort, '/code/views', '/dist/views');
      await handler.handleDirectory('');

      expect(await fsPort.fileExists('/dist/views/page/sub-page/_index/sub-page.view.php')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/page/sub-page/_index/sub-page.view.scss')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/page/sub-page/_index/sub-page.view.css')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/page/sub-page/_index/sub-page.view.tpl')).toEqual(true);
      expect(await fsPort.fileExists('/dist/views/page/sub-page/_index/sub-page.view.ts')).toEqual(false);
      expect(await fsPort.fileExists('/dist/views/page/sub-page/_index/sub-page.view.js')).toEqual(true);
      expect(await fsPort.readFile('/dist/views/page/sub-page/_index/sub-page.view.php')).toEqual('sub-page.view.php');
      expect(await fsPort.readFile('/dist/views/page/sub-page/_index/sub-page.view.css')).toEqual('sub-page.view.scss');
      expect(await fsPort.readFile('/dist/views/page/sub-page/_index/sub-page.view.tpl')).toEqual('sub-page.view.tpl');
      expect(await fsPort.readFile('/dist/views/page/sub-page/_index/sub-page.view.js')).toEqual('sub-page.view.ts');
    });
  });
});
