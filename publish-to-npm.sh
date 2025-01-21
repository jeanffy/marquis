#npm version minor -m 'ci: bump version %s'
npm i
npm run build
npm publish
git push --follow-tags
