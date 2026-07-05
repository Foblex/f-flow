import { fSuppressDevWarnings } from './domain';

// Module evaluation runs while the spec bundle loads — before any test executes —
// so the library's own suites don't spray FF-diagnostic warnings from minimal
// fixtures (zero-height hosts, detached projections). Real apps are unaffected.
fSuppressDevWarnings(true);

describe('test setup', () => {
  it('should silence dev diagnostics for the library test-suite', () => {
    expect(true).toBeTrue();
  });
});
