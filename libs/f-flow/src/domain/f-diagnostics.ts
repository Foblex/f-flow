declare const ngDevMode: boolean | undefined;

const DIAGNOSTICS_URL = 'https://flow.foblex.com/docs/errors';

const _reported = new Set<string>();

/**
 * Dev-mode diagnostics with stable `FFxxxx` codes.
 *
 * AI agents and developers iterate on console output, so misconfigurations that would
 * otherwise fail silently (an unresolved connection, a zero-height host) are surfaced as
 * one-shot warnings with a code and a link to the fix. Warnings are stripped in
 * production builds via the `ngDevMode` guard; error messages keep their code and link
 * in all builds.
 */
export function isFDevMode(): boolean {
  return typeof ngDevMode === 'undefined' || !!ngDevMode;
}

/**
 * Formats a diagnostic message with its stable code and documentation link,
 * e.g. `[f-flow][FF1001] ... See https://flow.foblex.com/docs/errors#ff1001`.
 */
export function fDiagnosticMessage(code: string, message: string): string {
  return `[f-flow][${code}] ${message} See ${DIAGNOSTICS_URL}#${code.toLowerCase()}`;
}

/**
 * Emits a dev-mode console warning once per `code + key` pair, so redraw loops do not
 * spam the console. No-op in production builds.
 */
let _suppressed = false;

/**
 * Silences dev-mode diagnostic WARNINGS for the current runtime — intended for the
 * library's own test suites, where fixtures legitimately violate the checks (zero
 * height hosts, detached projections) and the noise would drown real warnings.
 * Errors are not affected. No-op in production builds.
 */
export function fSuppressDevWarnings(suppress: boolean): void {
  _suppressed = suppress;
}

export function fWarnOnce(code: string, key: string, message: string): void {
  if (!isFDevMode() || _suppressed) {
    return;
  }

  const dedupeKey = `${code}|${key}`;
  if (_reported.has(dedupeKey)) {
    return;
  }
  _reported.add(dedupeKey);

  console.warn(fDiagnosticMessage(code, message));
}
