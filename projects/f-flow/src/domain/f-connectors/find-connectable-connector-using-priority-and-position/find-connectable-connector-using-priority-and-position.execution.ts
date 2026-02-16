import { IPoint, ITransformModel, Point, RectExtensions } from '@foblex/2d';
import { FindConnectableConnectorUsingPriorityAndPositionRequest } from './find-connectable-connector-using-priority-and-position.request';
import { inject, Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';
import { IClosestConnectorRef } from '../i-closest-connector-ref';
import { CalculateClosestConnectorRequest } from '../calculate-closest-connector';
import { FSnapConnectionComponent } from '../../../f-connection';
import { IConnectorRectRef } from '../i-connector-rect-ref';

/**
 * Execution that finds a connectable connector at a given position with priority.
 * It checks for connectors at the position, the closest connector if snap connection is enabled,
 * and the first connectable connector of the node at that position.
 */
@Injectable()
@FExecutionRegister(FindConnectableConnectorUsingPriorityAndPositionRequest)
export class FindConnectableConnectorUsingPriorityAndPositionExecution
  implements
    IExecution<FindConnectableConnectorUsingPriorityAndPositionRequest, FConnectorBase | undefined>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private get _fHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _fNodes(): FNodeBase[] {
    return this._store.nodes.getAll();
  }

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.connections.getForSnap();
  }

  public handle(
    payload: FindConnectableConnectorUsingPriorityAndPositionRequest,
  ): FConnectorBase | undefined {
    const connectors = this._findConnectorAtPosition(payload);

    return connectors.length > 0 ? connectors[0] : undefined;
  }

  private _findConnectorAtPosition(
    request: FindConnectableConnectorUsingPriorityAndPositionRequest,
  ): FConnectorBase[] {
    const result: FConnectorBase[] = [];

    result.push(...this._filterConnectorsThatLocatedAtPosition(request));

    // Closest connector is only added if snap connection is enabled and there is a closest connector found
    // Closest connector has more priority than the first connectable input of the node at position
    const closestConnector = this._isSnapConnectionEnabledAndHasClosestConnector(request);
    if (closestConnector) {
      result.unshift(closestConnector.connector);
    }

    const fInput = this._getFirstConnectableConnectorOfNodeAtPosition(request);
    if (fInput) {
      result.push(fInput);
    }

    return result;
  }

  private _filterConnectorsThatLocatedAtPosition(
    request: FindConnectableConnectorUsingPriorityAndPositionRequest,
  ): FConnectorBase[] {
    return request.connectableConnectors
      .filter((x) => {
        return RectExtensions.isIncludePoint(x.rect, this._getPointInFlow(request.pointerPosition));
      })
      .map((x) => x.connector);
  }

  private _getPointInFlow(position: IPoint): IPoint {
    return Point.fromPoint(position)
      .elementTransform(this._fHost)
      .sub(this._transform.scaledPosition)
      .sub(this._transform.position)
      .div(this._transform.scale);
  }

  private _isSnapConnectionEnabledAndHasClosestConnector(
    request: FindConnectableConnectorUsingPriorityAndPositionRequest,
  ): IClosestConnectorRef | undefined {
    if (!this._snapConnection) {
      return undefined;
    }

    const closestConnector = this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(
        this._getPointInFlow(request.pointerPosition),
        request.connectableConnectors,
      ),
    );

    return this._isValidClosestInput(closestConnector) ? closestConnector : undefined;
  }

  private _isValidClosestInput(closestConnector: IClosestConnectorRef | undefined): boolean {
    return !!closestConnector && closestConnector.distance < this._snapConnection!.fSnapThreshold;
  }

  //if node placed in position and fConnectOnNode is true, return the first connectable connector of the node
  private _getFirstConnectableConnectorOfNodeAtPosition(
    request: FindConnectableConnectorUsingPriorityAndPositionRequest,
  ): FConnectorBase | undefined {
    return this._getElementsFromPoint(request.pointerPosition)
      .map((x) => this._findConnectableNode(x))
      .filter((x) => !!x)
      .map((x) => this._findFirstConnectableConnectorOfNode(request.connectableConnectors, x))
      .find((x) => !!x);
  }

  private _getElementsFromPoint(position: IPoint): HTMLElement[] {
    return this._browser.document.elementsFromPoint(position.x, position.y) as HTMLElement[];
  }

  private _findConnectableNode(element: HTMLElement): FNodeBase | undefined {
    return this._fNodes.find((x) => x.isContains(element) && x.fConnectOnNode());
  }

  private _findFirstConnectableConnectorOfNode(
    connectableInputs: IConnectorRectRef[],
    fNode: FNodeBase,
  ): FConnectorBase | undefined {
    return connectableInputs.find((x) => x.connector.fNodeId === fNode.fId())?.connector;
  }
}
