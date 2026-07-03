# Using AI Agents with Foblex Flow

Foblex Flow ships several channels that teach LLMs and AI coding agents the current API, so generated code matches the installed version instead of outdated training data or React Flow patterns.

## In your project (recommended)

`ng add @foblex/flow` writes a marker-delimited **Foblex Flow section into your workspace `AGENTS.md`** — the cross-tool rules file read by Cursor, GitHub Copilot, Claude Code, Codex, and others. The section points agents at the guide bundled inside the package:

- `node_modules/@foblex/flow/AI.md` — verified API surface, hard rules, a minimal working setup, and a checklist of common silent failures.
- `node_modules/@foblex/flow/STYLING.md` — runtime CSS classes and safe selector strategy.

Because the guide ships inside the npm package, it always matches the installed version — agents do not need to guess or search. Re-running `ng add` refreshes only the managed block; pass `--skip-agent-rules` to opt out.

Already installed? Add the section without re-running the full schematic by copying it from [AGENTS.md on GitHub](https://github.com/Foblex/f-flow/blob/main/libs/f-flow/AI.md) or re-run `ng add @foblex/flow` — the dependency steps are idempotent.

## Hosted LLM docs

- [llms.txt](https://flow.foblex.com/llms.txt) — docs index in the [llms.txt](https://llmstxt.org) format.
- [llms-full.txt](https://flow.foblex.com/llms-full.txt) — the complete LLM-readable reference: API tables, events, types, styling, and full code examples. Point a custom agent, GPT, or RAG pipeline here.

## MCP / Context7

The repository ships a `context7.json`, so [Context7](https://context7.com) indexes the documentation — agents with the Context7 MCP server installed can resolve `@foblex/flow` docs on demand.

## Diagnostics agents can act on

In dev mode the library reports misconfigurations with stable `FFxxxx` codes — an unresolved connection endpoint, a zero-height host, a connector outside a node — each linking to [the errors reference](errors) with the fix. An agent iterating on console output self-corrects instead of guessing.

## Verifying generated code

A flow is fully wired when:

1. `(fFullRendered)` has fired on `<f-flow>`.
2. `flow.getState()` shows every declared connection resolved.
3. The console contains no `FFxxxx` warnings.

This three-step check is cheap enough to run in e2e tests and agent verification loops alike.
