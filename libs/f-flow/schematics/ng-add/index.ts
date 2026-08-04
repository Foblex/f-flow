import { json } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { updateWorkspace } from '@schematics/angular/utility';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { FoblexDependencies } from '../shared/foblex-dependencies';

const DEFAULT_THEME_STYLE_PATH = 'node_modules/@foblex/flow/styles/default.scss';
const KNOWN_THEME_STYLE_PATHS = new Set([
  DEFAULT_THEME_STYLE_PATH,
  '@foblex/flow/styles/default.scss',
]);

const AGENT_RULES_PATH = 'AGENTS.md';
const AGENT_RULES_BEGIN = '<!-- BEGIN:foblex-flow-agent-rules -->';
const AGENT_RULES_END = '<!-- END:foblex-flow-agent-rules -->';
const CLAUDE_RULES_PATH = 'CLAUDE.md';
const CLAUDE_AGENTS_IMPORT = '@AGENTS.md';
const CLAUDE_AGENTS_IMPORT_PATTERN =
  /(?:^|[^\p{L}\p{N}_])@(?:\.\/)?AGENTS\.md(?=$|[^\p{L}\p{N}_/-])/u;
const AGENT_RULES_BLOCK = `${AGENT_RULES_BEGIN}

## Foblex Flow (\`@foblex/flow\`)

Before writing any code that uses \`@foblex/flow\`, read the AI guide bundled with the
package: \`node_modules/@foblex/flow/AI.md\`. It contains the verified API surface, hard
rules (no React Flow patterns), a current \`fConnector\` setup, the choice between classic
app-owned records and opt-in \`withFlowState()\` managed records, and a checklist of common
silent failures. Domain validation, permissions, and persistence remain application
concerns in both state modes.

Additional references:

- Full curated LLM-readable reference: https://flow.foblex.com/llms-full.txt
- Docs index for agents: https://flow.foblex.com/llms.txt
- Diagnostic codes (\`FFxxxx\` console warnings/errors): https://flow.foblex.com/docs/errors
- Styling rules: \`node_modules/@foblex/flow/STYLING.md\`

${AGENT_RULES_END}`;

interface NgAddOptions {
  skipAgentRules?: boolean;
}

export function ngAdd(options: NgAddOptions = {}): Rule {
  return chain([
    addDependencies(),
    addDefaultTheme(),
    ...(options.skipAgentRules ? [] : [addAgentRules()]),
    installDependencies(),
  ]);
}

/**
 * Writes a marker-delimited Foblex Flow section into the workspace `AGENTS.md`, then
 * ensures Claude Code imports that canonical file from `CLAUDE.md`. Re-running `ng add`
 * only rewrites the managed block and does not duplicate the Claude import; content
 * outside that block is left untouched.
 */
function addAgentRules(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const existing = tree.exists(AGENT_RULES_PATH)
      ? (tree.read(AGENT_RULES_PATH)?.toString() ?? '')
      : null;

    if (existing === null) {
      tree.create(AGENT_RULES_PATH, `# AGENTS.md\n\n${AGENT_RULES_BLOCK}\n`);
      context.logger.info(`✅ Created "${AGENT_RULES_PATH}" with Foblex Flow agent rules.`);
    } else {
      const eol = getLineEnding(existing);
      const agentRulesBlock = AGENT_RULES_BLOCK.replace(/\n/gu, eol);
      const begins = findStandaloneMarkerLines(existing, AGENT_RULES_BEGIN);
      const ends = findStandaloneMarkerLines(existing, AGENT_RULES_END);

      if (begins.length === 0 && ends.length === 0) {
        tree.overwrite(
          AGENT_RULES_PATH,
          existing.length === 0
            ? `# AGENTS.md${eol}${eol}${agentRulesBlock}${eol}`
            : appendMarkdownBlock(existing, agentRulesBlock, eol),
        );
        context.logger.info(`✅ Added Foblex Flow agent rules to "${AGENT_RULES_PATH}".`);
      } else if (begins.length === 1 && ends.length === 1 && ends[0] > begins[0]) {
        const updated =
          existing.slice(0, begins[0]) +
          agentRulesBlock +
          existing.slice(ends[0] + AGENT_RULES_END.length);

        if (updated !== existing) {
          tree.overwrite(AGENT_RULES_PATH, updated);
          context.logger.info(`✅ Updated Foblex Flow agent rules in "${AGENT_RULES_PATH}".`);
        }
      } else {
        context.logger.warn(
          `⚠️ Left "${AGENT_RULES_PATH}" unchanged because its Foblex Flow markers are malformed. Fix or remove the marker lines, then re-run ng add.`,
        );
      }
    }

    ensureClaudeImportsAgentRules(tree, context);

    return tree;
  };
}

function ensureClaudeImportsAgentRules(tree: Tree, context: SchematicContext): void {
  const existing = tree.exists(CLAUDE_RULES_PATH)
    ? (tree.read(CLAUDE_RULES_PATH)?.toString() ?? '')
    : null;

  if (existing === null) {
    tree.create(CLAUDE_RULES_PATH, `${CLAUDE_AGENTS_IMPORT}\n`);
    context.logger.info(
      `✅ Created "${CLAUDE_RULES_PATH}" with an import of "${AGENT_RULES_PATH}".`,
    );

    return;
  }

  if (hasClaudeAgentsImport(existing)) {
    return;
  }

  const eol = getLineEnding(existing);
  const updated = appendMarkdownBlock(existing, CLAUDE_AGENTS_IMPORT, eol);

  tree.overwrite(CLAUDE_RULES_PATH, updated);
  context.logger.info(`✅ Added an import of "${AGENT_RULES_PATH}" to "${CLAUDE_RULES_PATH}".`);
}

function getLineEnding(content: string): '\n' | '\r\n' {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

function appendMarkdownBlock(content: string, block: string, eol: string): string {
  const separator =
    content.length === 0
      ? ''
      : content.endsWith(`${eol}${eol}`)
        ? ''
        : content.endsWith(eol)
          ? eol
          : `${eol}${eol}`;

  return `${content}${separator}${block}${eol}`;
}

function findStandaloneMarkerLines(content: string, marker: string): number[] {
  const result: number[] = [];

  visitMarkdownProseLines(content, (line, offset) => {
    if (line === marker) {
      result.push(offset);
    }

    return false;
  });

  return result;
}

function hasClaudeAgentsImport(content: string): boolean {
  return visitMarkdownProseLines(content, (line) => {
    const prose = line.replace(/(`+).*?\1/gu, '');

    return CLAUDE_AGENTS_IMPORT_PATTERN.test(prose);
  });
}

function visitMarkdownProseLines(
  content: string,
  visitor: (line: string, offset: number) => boolean,
): boolean {
  let openFence: { character: string; length: number } | null = null;
  let offset = 0;

  for (const rawLine of content.match(/[^\n]*(?:\n|$)/gu) ?? []) {
    const lineWithCarriageReturn = rawLine.endsWith('\n') ? rawLine.slice(0, -1) : rawLine;
    const line = lineWithCarriageReturn.endsWith('\r')
      ? lineWithCarriageReturn.slice(0, -1)
      : lineWithCarriageReturn;
    const fenceMatch = line.match(/^[\t ]{0,3}(`{3,}|~{3,})(.*)$/u);

    if (openFence) {
      const marker = fenceMatch?.[1];
      const suffix = fenceMatch?.[2];

      if (
        marker?.startsWith(openFence.character) &&
        marker.length >= openFence.length &&
        suffix?.trim() === ''
      ) {
        openFence = null;
      }

      offset += rawLine.length;
      continue;
    }

    if (fenceMatch) {
      openFence = { character: fenceMatch[1][0], length: fenceMatch[1].length };
      offset += rawLine.length;
      continue;
    }

    if (visitor(line, offset)) {
      return true;
    }

    offset += rawLine.length;
  }

  return false;
}

function addDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⚡ Installing @foblex/flow dependencies...');

    FoblexDependencies.forEach((dependency) => {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: dependency.name,
        version: dependency.version,
      });
      context.logger.info(`✅ Added "${dependency.name}" to package.json`);
    });

    return tree;
  };
}

function addDefaultTheme(): Rule {
  return updateWorkspace((workspace) => {
    for (const [, project] of workspace.projects) {
      if (project.extensions['projectType'] !== 'application') {
        continue;
      }

      addStyleToTarget(project.targets.get('build'));
      addStyleToTarget(project.targets.get('test'));
    }
  });
}

function addStyleToTarget(target?: {
  options?: Record<string, json.JsonValue | undefined>;
  configurations?: Record<string, Record<string, json.JsonValue | undefined> | undefined>;
}): void {
  if (!target) {
    return;
  }

  ensureThemeInStyles((target.options ??= {}));

  if (!target.configurations) {
    return;
  }

  Object.values(target.configurations).forEach((configuration) => {
    if (!configuration) {
      return;
    }

    ensureThemeInStyles(configuration);
  });
}

function ensureThemeInStyles(options: Record<string, json.JsonValue | undefined>): void {
  const styles = Array.isArray(options['styles']) ? [...options['styles']] : [];

  if (styles.some(isThemeStyleEntry)) {
    return;
  }

  styles.push(DEFAULT_THEME_STYLE_PATH);
  options['styles'] = styles;
}

function isThemeStyleEntry(entry: json.JsonValue | undefined): boolean {
  if (typeof entry === 'string') {
    return KNOWN_THEME_STYLE_PATHS.has(entry);
  }

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return false;
  }

  const input = (entry as Record<string, unknown>)['input'];

  return typeof input === 'string' && KNOWN_THEME_STYLE_PATHS.has(input);
}

function installDependencies(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.info(`✅ Added "${DEFAULT_THEME_STYLE_PATH}" to application styles.`);
    context.logger.info('✅ All dependencies installed successfully.');

    return _tree;
  };
}
