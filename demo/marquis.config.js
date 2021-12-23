const marquis = {
  cache: {
    enabled: false
  },
  outputDir: 'dist',
  pages: {
    dir: 'src/pages',
    default: 'home',
    excludes: ['_skeleton.twig', '_utils.php']
  },
  styles: {
    dir: 'src/styles'
  },
  scripts: {
    dir: 'src/scripts',
    typeRoots: ['src/js/types']
  },
  assets: {
    dir: 'src/assets'
  },
  additionalFiles: [
    'src/favicon.ico',
    'src/.user.ini',
    { src: 'src/pages/_utils.php', dst: 'pages' }
  ]
};

module.exports = marquis;
