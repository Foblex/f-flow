import { Inject, Injectable, Optional } from '@angular/core';
import { IFConnectionBuilder } from './i-f-connection-builder';
import { EFConnectionType, FBezierPathBuilder, FSegmentPathBuilder, FStraightPathBuilder } from '../common';
import { F_CONNECTION_BUILDERS, IFConnectionBuilders } from './f-connection-builders';
import { IFConnectionFactoryRequest } from './i-f-connection-factory-request';
import { IFConnectionBuilderResponse } from './i-f-connection-builder-response';
import { IMap } from '../../domain';

@Injectable()
export class FConnectionFactory {

  private readonly builders: IMap<IFConnectionBuilder> = {

    [ EFConnectionType.STRAIGHT ]: new FStraightPathBuilder(),

    [ EFConnectionType.BEZIER ]: new FBezierPathBuilder(),

    [ EFConnectionType.SEGMENT ]: new FSegmentPathBuilder(),
  }

  constructor(
    @Optional() @Inject(F_CONNECTION_BUILDERS) builders: IFConnectionBuilders,
  ) {
    if (builders) {
      this.builders = { ...this.builders, ...builders };
    }
  }

  public handle(request: IFConnectionFactoryRequest): IFConnectionBuilderResponse {
    const builder = this.builders[ request.type ];
    if (!builder) {
      throw new Error(`FConnectionBuilder not found for type ${ request.type }`);
    }

    return builder.handle(request.payload);
  }
}
