export async function buildPhpVendor(): Promise<void> {
  // --------------------------------------------------------------
  // composer
  // --------------------------------------------------------------

  // logAction('Installing composer');

  // const userPackageJsonPath = path.join(PROJDIR, 'package.json');
  // const userPackageJsonContent = JSON.parse(await fs.readFile(userPackageJsonPath, { encoding: 'utf-8' }));

  // const userComposerJsonPath = path.join(PROJDIR, 'composer.json');
  // if (await fileExists(userComposerJsonPath)) {
  //   const userComposerJsonContent = JSON.parse(await fs.readFile(userComposerJsonPath, { encoding: 'utf-8' }));
  // }

  // const composerJsonPath = await exportTemplate('composer.json.twig', TMPDIR, 'composer.json', {
  //   name: userPackageJsonContent.name,
  //   vendorDir: path.join(OUTDIR, 'vendor'),
  //   binDir: path.join(OUTDIR, 'vendor', 'bin')
  // });

  // await promiseSpawn('composer install', {
  //   shell: true,
  //   stdio: 'inherit',
  //   env: {
  //     ...process.env,
  //     COMPOSER: composerJsonPath
  //   }
  //   //shell:
  // });
}
