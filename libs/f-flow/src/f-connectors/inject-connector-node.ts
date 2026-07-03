import { inject } from '@angular/core';
import { F_NODE, FNodeBase } from '../f-node';
import { fDiagnosticMessage } from '../domain';

/**
 * Resolves the host node of a connector directive. A connector outside `[fNode]` /
 * `[fGroup]` used to fail with a bare `NullInjectorError`; this raises an actionable
 * error naming the selector and the fix instead.
 */
export function injectConnectorNode(selector: string): FNodeBase {
  const node = inject(F_NODE, { optional: true });

  if (!node) {
    throw new Error(
      fDiagnosticMessage(
        'FF1003',
        `${selector} must be placed on an element inside [fNode] or [fGroup].`,
      ),
    );
  }

  return node;
}
