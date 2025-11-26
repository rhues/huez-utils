<!-- Copilot / AI agent instructions for contributors to the huez-util repo -->
# huez-util — AI assistant guide

This file gives concise, repository-specific instructions so an AI coding assistant can be productive immediately.

- Project layout: `src/` contains the library code. Two primary namespaces are exposed from `src/index.js`: `text` and `validation` (see `src/text/_index.js` and `src/validation/_index.js`). Tests live in `spec/` and are executed via `run-tests.js` (Jasmine).

- Runtime/module system: The package uses native ES modules (`"type": "module"` in `package.json`). Exports are named; prefer named exports and use `import`/`export` syntax.

- Build & test commands (use these exact commands):
  - `npm run dev` — start Vite dev server
  - `npm run build` — produce `dist/` bundles
  - `npm run lint` — run ESLint over `src`
  - `npm run test` — run tests via `node run-tests.js` (Jasmine)
  - `npm run coverage` — run coverage with `c8 node run-tests.js`

- Testing details: Tests are Jasmine specs under `spec/`. `run-tests.js` loads `jasmine.mjs` config. When suggesting or modifying tests, follow existing spec style (e.g., `spec/validation/email.spec.js`).

- Code patterns & conventions (concrete examples):
  - Validation functions return a `ValidationResult` shaped like `{ valid: boolean, errors: Array<{code:string, message:string}> }`. See `src/validation/email.js` and `src/validation/domain.js` for canonical examples.
  - Blank/empty values are often treated as valid by validators — callers are expected to compose validators when required. For example `email('')` returns `{ valid: true }`.
  - Error objects use concise `code` strings (e.g. `invalidDomainTld`, `invalidEmailLocalPartLength`) — prefer reusing existing codes when possible.
  - Export pattern: aggregate named exports into a namespace object in `_index.js` files. Example: `export const text = { canvasWordWrap, clearCanvasWordWrapCache }`.
  - Performance / caching: `text.canvasWordWrap` memoizes results in an internal `wordWrapLookup` object and exposes `clearCanvasWordWrapCache()` to clear it.
  - Use JSDoc comments for public functions and retain the `@module`/`@memberof` annotations used throughout the repo.
  - Avoid changing public API shapes (exports or validation result formats) unless updating all downstream usages and tests.

- Implementation guidance when adding validation rules:
  - Follow the style in `src/validation/domain.js`: check lengths, split labels by `.`, validate characters by codepoints using `Array.from(...).map(c => c.codePointAt(0))`.
  - When checking TLDs, the repo uses an embedded `tldList` Set and uppercases TLDs before membership test; follow that approach for consistency.

- Type hints & packaging: Types are provided as JSDoc and `src/index.d.ts`. The package builds `dist/` and `types` entries in `package.json` point to the generated artifacts. Do not remove `types` entries.

- When editing code, run the project checks locally (these commands work on Windows PowerShell):
```pwsh
npm run lint
npm run test
npm run coverage
```

- Files to reference for examples:
  - `src/text/canvasWordWrap.js` — memoization + canvas measuring pattern
  - `src/validation/domain.js` — canonical domain validation with TLD list
  - `src/validation/email.js` — composition of `domain` + local-part rules
  - `run-tests.js` and `jasmine.mjs` — test runner wiring

- PR/commit guidance for AI changes:
  - Keep changes minimal and focused to the issue.
  - Update or add tests in `spec/` that demonstrate intended behavior; run `npm run test`.
  - If adding a public function, add JSDoc and export it via the appropriate `_index.js` file.

If anything here is unclear or you want more detail about a particular area, say which files or behaviors you want expanded and I will update these instructions.
