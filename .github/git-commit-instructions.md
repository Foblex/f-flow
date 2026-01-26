Write your commit message in the Conventional Commits format.

Requirements:

- Title: <type>(<scope>): <brief description of what was done>
- Use the following types: feat, fix, refactor, perf, docs, test, chore.
- Scope: module/feature name (e.g., auth, payments, flow-editor).
- Title up to 72 characters, without a period at the end.

Body (required if there is more than one change):

- 3–7 bullet points, each with a past tense verb.
- Indicate important behavior changes, migrations, and removed fields/methods.
- If there is a BREAKING CHANGE, add it as a separate section "BREAKING CHANGE:".

If the change log shows the issue number (JIRA/GH issue), add the following footer at the end: "Refs: XXX-123".
Don't invent things that aren't in the diff.
