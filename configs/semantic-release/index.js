const { execSync } = require('node:child_process');
const { join, resolve } = require('node:path');

const srcPath = resolve(process.cwd());
const packageJsonPath = join(srcPath, 'package.json');
const { name } = require(packageJsonPath);

const changelogFileName = `${name.toUpperCase()}.md`;

const repoRootPath = resolve(execSync('git rev-parse --show-toplevel').toString().trim());
const relativeRootPath = srcPath.replace(repoRootPath, '').slice(1).replaceAll('\\', '/');

const versionsFolderRelativePath = [
  ...relativeRootPath
    .split('/')
    .map(() => '..'),
  'CHANGELOG',
].join('/');

const changelogFile = [versionsFolderRelativePath, changelogFileName].join('/');

console.log({ changelogFile })

module.exports = {
  branches: ['master'],
  extends: 'semantic-release-monorepo',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile,
      },
    ],
    [
      '@semantic-release/npm',
    ],
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version}',
      },
    ],
  ],
};
