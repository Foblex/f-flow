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
const AGENT_RULES_BLOCK = `${AGENT_RULES_BEGIN}

## Foblex Flow (\`@foblex/flow\`)

Before writing any code that uses \`@foblex/flow\`, read the AI guide bundled with the
package: \`node_modules/@foblex/flow/AI.md\`. It contains the verified API surface, hard
rules (no React Flow patterns, the app owns graph state), a minimal working setup, and a
checklist of common silent failures.

Additional references:

- Complete LLM-readable API reference: https://flow.foblex.com/llms-full.txt
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
 * Writes a marker-delimited Foblex Flow section into the workspace `AGENTS.md`, so AI
 * coding agents (Cursor, Copilot, Claude Code, Codex, …) read the bundled
 * `node_modules/@foblex/flow/AI.md` before generating code. Re-running `ng add` only
 * rewrites the managed block; the rest of the file is left untouched.
 */
function addAgentRules(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const existing = tree.exists(AGENT_RULES_PATH)
      ? (tree.read(AGENT_RULES_PATH)?.toString() ?? '')
      : null;

    if (existing === null) {
      tree.create(AGENT_RULES_PATH, `# AGENTS.md\n\n${AGENT_RULES_BLOCK}\n`);
      context.logger.info(`✅ Created "${AGENT_RULES_PATH}" with Foblex Flow agent rules.`);

      return tree;
    }

    const begin = existing.indexOf(AGENT_RULES_BEGIN);
    const end = existing.indexOf(AGENT_RULES_END);

    const updated =
      begin >= 0 && end > begin
        ? existing.slice(0, begin) +
          AGENT_RULES_BLOCK +
          existing.slice(end + AGENT_RULES_END.length)
        : `${existing.replace(/\s*$/, '')}\n\n${AGENT_RULES_BLOCK}\n`;

    if (updated !== existing) {
      tree.overwrite(AGENT_RULES_PATH, updated);
      context.logger.info(`✅ Updated Foblex Flow agent rules in "${AGENT_RULES_PATH}".`);
    }

    return tree;
  };
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
