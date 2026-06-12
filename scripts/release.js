#!/usr/bin/env node
/**
 * Release easy button: verify a clean, current main; run the quality gates;
 * rebuild dist; bump the version; tag; push; pack the vendor tarball.
 *
 *   npm run release            # patch bump
 *   npm run release minor
 *   npm run release major
 *
 * Tags carry no "v" prefix (see .npmrc). Consumers vendor the packed tarball
 * in their repo and pin:  "huez-utils": "file:vendor/huez-utils-x.y.z.tgz"
 *
 * An optional .release-targets file (gitignored, one directory per line,
 * # comments allowed) lists consumer vendor dirs that receive a copy of the
 * tarball automatically. Bumping each consumer's file: spec stays manual.
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const BUMPS = ['patch', 'minor', 'major']
const bump = process.argv[2] ?? 'patch'

function fail(message) {
  console.error(`\nrelease: ${message}`)
  process.exit(1)
}

function run(command) {
  console.log(`\n> ${command}`)
  execSync(command, { stdio: 'inherit' })
}

function capture(command) {
  return execSync(command, { encoding: 'utf8' }).trim()
}

if (!BUMPS.includes(bump)) {
  fail(`unknown bump "${bump}" — use ${BUMPS.join(' | ')}`)
}

// Preflight: on main, clean tree, not behind origin.
if (capture('git branch --show-current') !== 'main') {
  fail('not on main — releases are cut from main only')
}
if (capture('git status --porcelain') !== '') {
  fail('working tree is not clean — commit or stash first')
}
run('git fetch origin main')
const behind = capture('git rev-list --count HEAD..origin/main')
if (behind !== '0') {
  fail(`main is ${behind} commit(s) behind origin/main — pull first`)
}

// Quality gates — the definition of done.
run('npm test')
run('npm run lint')

// dist/ is tracked in git; rebuild so the release tag carries a dist that
// matches the source, and npm version sees a clean tree.
run('npm run build')
if (capture('git status --porcelain') !== '') {
  run('git add dist')
  run('git commit -m "chore: rebuild dist for release"')
}

// Bump + tag, then push both.
run(`npm version ${bump} -m "chore(release): %s"`)
const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
run('git push --follow-tags')

// Pack the tarball consumers vendor; the tree is clean and just-tagged, so
// the artifact matches the tag without touching the network. (dist/ is the
// vite build output, so tarballs land in release/ instead.)
mkdirSync('release', { recursive: true })
const [{ filename }] = JSON.parse(capture('npm pack --json --pack-destination release'))
const tarball = join('release', filename)
console.log(`\nPacked ${tarball}`)

const targets = existsSync('.release-targets')
  ? readFileSync('.release-targets', 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
  : []
for (const target of targets) {
  const dir = resolve(target)
  if (!existsSync(dir)) {
    console.warn(`  skipped missing target ${dir}`)
    continue
  }
  copyFileSync(tarball, join(dir, filename))
  console.log(`  delivered ${filename} -> ${dir}`)
}

console.log(`\nReleased ${version}`)
console.log('Consumers pin:')
console.log(`  "huez-utils": "file:vendor/${filename}"`)
