# Copilot Instructions for This Repository

## Project context
- This is a static website repository.
- Prefer simple HTML, CSS, and vanilla JavaScript solutions.
- Preserve the existing project structure and visual language unless asked otherwise.

## How to work in this repo
- Keep changes focused and minimal.
- Do not refactor unrelated files.
- Reuse existing utilities and patterns before introducing new ones.
- Maintain accessibility and responsive behavior for all page updates.
- Whenever a function or method is used more than once, consider creating a utility function for it.
- If any styling changes are made, ensure both light and dark modes are supported.

## JavaScript changes
- If a source file in `js/` is updated, also update the corresponding file in `js/min/`.
- Use the repo tooling for minification when needed (`tools/minify-js.mjs`).

## Validation
- Run tests after meaningful code changes.
- Preferred test command: `npm run test:e2e`.
- If tests cannot be run, clearly state why.

## Communication style
- Explain what changed and why.
- Call out risks or assumptions.
- Keep responses concise unless more detail is requested.

## Verification
- At the start of substantial tasks, explicitly confirm these repository instructions are being applied.
- In the final response, include a short compliance note that states:
	- Whether tests were run and the command used.
	- Whether any file in `js/` was changed and, if so, whether the matching file in `js/min/` was updated.
	- Any assumptions, constraints, or deviations from these instructions.
