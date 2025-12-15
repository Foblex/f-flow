import { inject, Injectable } from '@angular/core';
import { IFConnectionBuilder } from './i-f-connection-builder';
import {
  AdaptiveCurveBuilder,
  EFConnectionType,
  FBezierPathBuilder,
  FCustomPathBuilder,
  FSegmentPathBuilder,
  FStraightPathBuilder,
} from '../common';
import { F_CONNECTION_BUILDERS } from './f-connection-builders';
import { IFConnectionFactoryRequest } from './i-f-connection-factory-request';
import { IFConnectionBuilderResponse } from './i-f-connection-builder-response';
import { IMap } from '../../domain';

@Injectable()
export class FConnectionFactory {
  private readonly _builders: IMap<IFConnectionBuilder> = {
    [EFConnectionType.STRAIGHT]: new FStraightPathBuilder(),

    [EFConnectionType.BEZIER]: new FBezierPathBuilder(),

    [EFConnectionType.ADAPTIVE_CURVE]: new AdaptiveCurveBuilder(),

    [EFConnectionType.SEGMENT]: new FSegmentPathBuilder(),

    [EFConnectionType.CUSTOM_PATH]: new FCustomPathBuilder(),

    ...(inject(F_CONNECTION_BUILDERS, { optional: true }) || {}),
  };

  public handle(request: IFConnectionFactoryRequest): IFConnectionBuilderResponse {
    const builder = this._builders[request.type];
    if (!builder) {
      throw new Error(`FConnectionBuilder not found for type ${request.type}`);
    }

    return builder.handle(request.payload);
  }
}
