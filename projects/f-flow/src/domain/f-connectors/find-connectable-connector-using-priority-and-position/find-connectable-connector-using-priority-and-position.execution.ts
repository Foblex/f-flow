import { IPoint, ITransformModel, Point, RectExtensions } from '@foblex/2d';
import { FindConnectableConnectorUsingPriorityAndPositionRequest } from './find-connectable-connector-using-priority-and-position.request';
import { inject, Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';
import { IClosestConnector } from '../i-closest-connector';
import { CalculateClosestConnectorRequest } from '../calculate-closest-connector';
import { FSnapConnectionComponent } from '../../../f-connection';
import { IConnectorAndRect } from '../i-connector-and-rect';

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
    return this._store.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  private get _fNodes(): FNodeBase[] {
    return this._store.fNodes;
  }

  private get _fSnapConnection(): FSnapConnectionComponent | undefined {
    return this._store.fSnapConnection as FSnapConnectionComponent;
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
      result.unshift(closestConnector.fConnector);
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
        return RectExtensions.isIncludePoint(
          x.fRect,
          this._getPointInFlow(request.pointerPosition),
        );
      })
      .map((x) => x.fConnector);
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
  ): IClosestConnector | undefined {
    if (!this._fSnapConnection) {
      return undefined;
    }

    const closestConnector = this._mediator.execute<IClosestConnector | undefined>(
      new CalculateClosestConnectorRequest(
        this._getPointInFlow(request.pointerPosition),
        request.connectableConnectors,
      ),
    );

    return this._isValidClosestInput(closestConnector) ? closestConnector : undefined;
  }

  private _isValidClosestInput(closestConnector: IClosestConnector | undefined): boolean {
    return !!closestConnector && closestConnector.distance < this._fSnapConnection!.fSnapThreshold;
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
    connectableInputs: IConnectorAndRect[],
    fNode: FNodeBase,
  ): FConnectorBase | undefined {
    return connectableInputs.find((x) => x.fConnector.fNodeId === fNode.fId())?.fConnector;
  }
}
