# Contributing

Thanks for your interest in improving this Chrome Extension (Manifest V3).

This document focuses on two areas:

* Guidelines for pull requests
* Code style and formatting conventions

## Pull requests

1. Fork the repository and create a feature branch from `main`.
2. Keep PRs focused and small. Separate unrelated changes.
3. Link an issue if one exists, or clearly state the problem and solution in the PR description.
4. Include screenshots or screencasts if UI or behavior changes.
5. Add or update documentation when user-facing behavior changes.
6. Ensure checks pass locally before opening the PR:

   * `npm ci`
   * `npm run lint`
   * `npm test` (if tests are present)
   * `npm run build` to validate the MV3 bundle
7. One approving review and green CI are required before merge.
8. Use squash-and-merge unless there is a strong reason not to.
9. Security and privacy:

   * Only request minimal permissions in `manifest.json`.
   * Avoid remote code or dynamic code execution that violates MV3 policies.
   * Do not commit secrets or API keys. Use `.env.example` for placeholders.
10. MV3 specifics:

* Keep the background service worker stateless and fast to start.
* Use `chrome.scripting` instead of deprecated APIs.
* Validate `manifest.json` and keys before submitting to the Chrome Web Store.

## Code style and formatting

* Language: JavaScript and HTML/CSS for MV3.
* Environment: Node 18 LTS and npm.
* Editor: enable EditorConfig if present.

JavaScript

* Follow ESLint Standard rules plus Prettier for formatting.
* 2-space indentation.
* Line length: 100 characters.
* Semicolons: always.
* Quotes: single quotes for strings, backticks for template literals where needed.
* Trailing commas: es5.
* End of line: LF.
* Newline at EOF.

HTML/CSS

* Keep HTML semantic and minimal. Prefer data attributes for hooks.
* Avoid inline styles for logic; keep styles in CSS.
* Use BEM-like class naming where helpful.

Project hygiene

* Do not commit build artifacts under `dist/` or similar. Add them to `.gitignore`.
* Keep `manifest.json` minimal, with the least privileges necessary.
* Group content scripts and service worker code logically.
* Document any permissions or host permissions in README.

Commit messages

* Use Conventional Commits:

  * `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `build:`, `ci:`
  * Example: `feat: add options page link handling`
* Reference issues with `Fixes #123` or `Refs #123` where applicable.

Pre-commit and CI

* Use lint-staged to run Prettier and ESLint on changed files.
* CI should run `npm ci`, `npm run lint`, `npm test`, and `npm run build`.

Thank you for contributing.
