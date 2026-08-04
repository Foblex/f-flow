# Using AI Agents with Foblex Flow

Foblex Flow ships several channels that teach LLMs and AI coding agents the current API, so generated code matches the installed version instead of outdated training data or React Flow patterns.

## In your project (recommended)

`ng add @foblex/flow` writes a marker-delimited **Foblex Flow section into your workspace `AGENTS.md`**. This is the canonical shared instruction block for tools that support `AGENTS.md`, and it points agents at the guide bundled inside the package:

- `node_modules/@foblex/flow/AI.md` — verified API surface, hard rules, a minimal working setup, and a checklist of common silent failures.
- `node_modules/@foblex/flow/STYLING.md` — runtime CSS classes and safe selector strategy.

Because Claude Code loads project instructions from `CLAUDE.md`, the schematic also ensures that the root `CLAUDE.md` contains an `@AGENTS.md` import. Existing `CLAUDE.md` content is preserved, and re-running `ng add` does not duplicate the import.

The bundled guide matches the installed package version, so agents can verify the API locally instead of relying on outdated examples. Re-running `ng add` refreshes only the managed `AGENTS.md` block and keeps both instruction files idempotent. Pass `--skip-agent-rules` to skip changes to both `AGENTS.md` and `CLAUDE.md`.

Already installed? Re-run `ng add @foblex/flow`; its dependency, theme, and agent-instruction updates are idempotent.

## Hosted LLM docs

- [llms.txt](https://flow.foblex.com/llms.txt) — docs index in the [llms.txt](https://llmstxt.org) format.
- [llms-full.txt](https://flow.foblex.com/llms-full.txt) — a full curated LLM-readable reference covering core app-facing API tables, events, types, styling, and code examples. Point a custom agent, GPT, or RAG pipeline here.

## MCP / Context7

The repository ships a `context7.json`, so [Foblex Flow is indexed on Context7](https://context7.com/foblex/f-flow) — agents with the Context7 MCP server installed can resolve `@foblex/flow` docs on demand.

## Diagnostics agents can act on

In dev mode the library reports misconfigurations with stable `FFxxxx` codes — an unresolved connection endpoint, a zero-height host, a connector outside a node — each linking to [the errors reference](errors) with the fix. An agent iterating on console output self-corrects instead of guessing.

## Verifying generated code

Use three separate checks for generated flows:

1. Wait until `(fFullRendered)` fires on `<f-flow>` so the full render cycle has settled.
2. Compare the node, group, and connection ids from `flow.getState()` with the expected graph.
3. Fail on any `FFxxxx` console diagnostic; `FF1001` identifies an unresolved connection endpoint.

`getState()` exports registered graph records; it does not by itself prove that connection endpoints resolved. These checks are cheap enough to run in e2e tests and agent verification loops alike.
