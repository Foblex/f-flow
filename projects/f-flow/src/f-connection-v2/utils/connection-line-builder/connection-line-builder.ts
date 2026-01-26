import { IFConnectionBuilderResponse, IFConnectionBuilder } from './models';
import {
  CalculateAdaptiveCurveData,
  CalculateBezierCurveData,
  CalculateSegmentLineData,
  CalculateStraightLineData,
} from './builders';
import { ConnectionLineBuilderRequest } from './connection-line-builder-request';
import { inject, Injectable } from '@angular/core';
import { F_CONNECTION_BUILDERS } from './providers';
import { EFConnectionType } from '../../enums';

@Injectable()
export class ConnectionLineBuilder {
  private readonly _builtinBuilders: Record<string, IFConnectionBuilder> = {
    [EFConnectionType.STRAIGHT]: new CalculateStraightLineData(),
    [EFConnectionType.BEZIER]: new CalculateBezierCurveData(),
    [EFConnectionType.ADAPTIVE_CURVE]: new CalculateAdaptiveCurveData(),
    [EFConnectionType.SEGMENT]: new CalculateSegmentLineData(),
  };

  private readonly _providedBuilders: Record<string, IFConnectionBuilder>;
  private readonly _builders: Record<string, IFConnectionBuilder>;

  constructor() {
    this._providedBuilders = inject(F_CONNECTION_BUILDERS, { optional: true }) || {};
    this._builders = {
      ...this._builtinBuilders,
      ...this._providedBuilders,
    };
  }

  public handle({ type, payload }: ConnectionLineBuilderRequest): IFConnectionBuilderResponse {
    const builder = this._builders[type];
    if (!builder) {
      throw this._createBuilderNotFoundError(type);
    }

    return builder.handle(payload);
  }

  private _createBuilderNotFoundError(requestedType: string): Error {
    const builtinTypes = Object.keys(this._builtinBuilders).sort();
    const providedTypes = Object.keys(this._providedBuilders).sort();
    const registeredTypes = Object.keys(this._builders).sort();

    const overriddenBuiltins = builtinTypes.filter((t) => t in this._providedBuilders).sort();

    const lines = [
      `Connection Builder Error: builder type "${requestedType}" not found.`,
      `Registered types: ${registeredTypes.length ? registeredTypes.join(', ') : '(none)'}`,
      `Built-in types: ${builtinTypes.length ? builtinTypes.join(', ') : '(none)'}`,
      `Provided (F_CONNECTION_BUILDERS) types: ${providedTypes.length ? providedTypes.join(', ') : '(none)'}`,
      overriddenBuiltins.length ? `Overridden built-ins: ${overriddenBuiltins.join(', ')}` : null,
      `Tip: ensure you pass a valid Connection Type or provide a builder via F_CONNECTION_BUILDERS.`,
    ].filter(Boolean);

    return new Error(lines.join('\n'));
  }
}
