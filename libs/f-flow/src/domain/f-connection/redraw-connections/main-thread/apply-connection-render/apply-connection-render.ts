import { ILine, IPoint } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../../../create-connection-markers';
import { FConnectionBase, FConnectionContentBase } from '../../../../../f-connection-v2';
import { ApplyConnectionRenderRequest } from './apply-connection-render-request';

@Injectable()
@FExecutionRegister(ApplyConnectionRenderRequest)
export class ApplyConnectionRender implements IExecution<ApplyConnectionRenderRequest, void> {
  private readonly _mediator = inject(FMediator);

  private readonly _renderCache = new WeakMap<
    FConnectionBase,
    { signature: string; pathElement: SVGElement }
  >();

  public handle({ connection, line }: ApplyConnectionRenderRequest): void {
    const markersChanged = this._mediator.execute<boolean>(
      new CreateConnectionMarkersRequest(connection),
    );
    if (!markersChanged && !this._shouldRender(connection, line)) {
      return;
    }

    connection.setLine(line);
    connection.initialize();
  }

  private _shouldRender(connection: FConnectionBase, line: ILine): boolean {
    const pathElement = connection.fPath().hostElement;
    const signature = this._createConnectionRenderSignature(connection, line);
    const cached = this._renderCache.get(connection);
    if (cached?.signature === signature && cached.pathElement === pathElement) {
      return false;
    }

    this._renderCache.set(connection, { signature, pathElement });

    return true;
  }

  private _createConnectionRenderSignature(connection: FConnectionBase, line: ILine): string {
    const { sourceSide, targetSide } = connection.getResolvedSides();

    return [
      connection.fBehavior,
      connection.fType,
      connection.fRadius,
      connection.fOffset,
      connection.fReassignableStart(),
      this._serializeContents([...(connection.fContents() || [])]),
      sourceSide,
      targetSide,
      this._serializePoint(line.point1),
      this._serializePoint(line.point2),
      this._serializeWaypoints(connection.fWaypoints()?.waypoints() || []),
    ].join('|');
  }

  private _serializePoint(point: IPoint): string {
    return `${point.x}:${point.y}`;
  }

  private _serializeWaypoints(waypoints: IPoint[]): string {
    return waypoints.map(this._serializePoint).join(';');
  }

  private _serializeContents(contents: FConnectionContentBase[]): string {
    return contents
      .map((content) => {
        return [content.position(), content.offset(), content.align()].join(':');
      })
      .join(';');
  }
}
