# Copilot Instructions for This Repository

## Project context
- This is a static website repository.
- Prefer simple HTML, CSS, and vanilla JavaScript solutions.
- Preserve the existing project structure and visual language unless asked otherwise.
- Any page updates should work in both light and dark modes.
- Any page updates should be responsive and accessible.

## How to work in this repo
- Keep changes focused and minimal.
- Do not refactor unrelated files.
- Reuse existing utilities and patterns before introducing new ones.
- Maintain accessibility and responsive behavior for all page updates.
- Whenever a function or method is used more than once, consider creating a utility function for it.
- If any styling changes are made, ensure both light and dark modes are supported.
- If ever numbers are displayed, ensure they are formatted with commas as thousands separators (e.g., 1,000,000).
- All CSS changes should be kept within the `css/` directory and follow the existing naming conventions.
- Group related CSS rules together and maintain the existing order of rules within each file.

## JavaScript changes
- If a source file in `js/` is updated, also update the corresponding file in `js/min/`.
- Use the repo tooling for minification when needed (`tools/minify-js.mjs`).

## Validation
- Run tests after meaningful code changes.
- Preferred test command: `npm run test:e2e`.
- If tests cannot be run, clearly state why.
- No tests should be flaky; if they are, they should be fixed or removed.
- If any tests fail, provide a clear explanation of the failure and how to fix it; do not fix the tests without understanding the failure and explaining it.

## Communication style
- Explain what changed and why.
- Call out risks or assumptions.
- Keep responses concise unless more detail is requested.
- If a question is asked, answer it directly and clearly.
- If a question is asked that cannot be answered, explain why and what information is needed to answer it.
- Suggest changes to this instruction file if you think they would improve the workflow or code quality.

## Verification
- At the start of substantial tasks, explicitly confirm these repository instructions are being applied.
- In the final response, include a short compliance note that states:
	- Whether tests were run and the command used.
	- Whether any file in `js/` was changed and, if so, whether the matching file in `js/min/` was updated; if nothing was changed, do not include this line.
	- Any assumptions, constraints, or deviations from these instructions.
