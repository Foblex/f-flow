import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { findSourceConnector, findTargetConnector } from '../../../../../f-connectors';
import { ResolveConnectionEndpointsRequest } from './resolve-connection-endpoints-request';
import { IConnectionEndpoints } from '../../models';
import { fWarnOnce } from '../../../../f-diagnostics';

@Injectable()
@FExecutionRegister(ResolveConnectionEndpointsRequest)
export class ResolveConnectionEndpoints implements IExecution<
  ResolveConnectionEndpointsRequest,
  IConnectionEndpoints | null
> {
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: ResolveConnectionEndpointsRequest): IConnectionEndpoints | null {
    const source = findSourceConnector(this._store, connection.sourceId());
    const target = findTargetConnector(this._store, connection.targetId());
    if (!source || !target) {
      // While a progressive render is still adding nodes in chunks, unresolved
      // endpoints are a normal transient state — only warn once rendering settled.
      if (!this._store.hasPendingProgressiveRender) {
        if (!source) {
          this._warnUnresolved(connection.fId(), 'fSourceId', connection.sourceId());
        }
        if (!target) {
          this._warnUnresolved(connection.fId(), 'fTargetId', connection.targetId());
        }
      }

      return null;
    }

    return { source, target };
  }

  /**
   * An unresolved endpoint means the connection silently never renders — the most
   * common integration mistake (an id mismatch). Surface it once per connection + id
   * so the console points straight at the fix.
   */
  private _warnUnresolved(connectionId: string, inputName: string, id: string): void {
    // An id like "node.outputId" is almost always an unevaluated template expression.
    const bracketHint = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)+$/.test(id)
      ? ` The id looks like an unevaluated expression — did you mean a property binding, e.g. [${inputName}]="${id}"?`
      : '';

    fWarnOnce(
      'FF1001',
      `${connectionId}|${inputName}|${id}`,
      `<f-connection> "${connectionId}": ${inputName} "${id}" does not match any rendered connector, so the connection is not drawn.${bracketHint} Registered connector ids: ${this._registeredIds()}.`,
    );
  }

  private _registeredIds(): string {
    const ids = [
      ...this._store.connectors.getAll(),
      ...this._store.outputs.getAll(),
      ...this._store.inputs.getAll(),
      ...this._store.outlets.getAll(),
    ].map((x) => `"${x.fId()}"`);

    if (!ids.length) {
      return '(none rendered yet)';
    }

    const preview = ids.slice(0, 15).join(', ');

    return ids.length > 15 ? `${preview} and ${ids.length - 15} more` : preview;
  }
}
