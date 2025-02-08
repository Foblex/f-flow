import { IPoint, ITransformModel, Point, RectExtensions } from '@foblex/2d';
import { FindInputAtPositionRequest } from './find-input-at-position.request';
import { inject, Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';
import { IClosestInput } from '../i-closest-input';
import { CalculateClosestInputRequest } from '../calculate-closest-input';
import { FSnapConnectionComponent } from '../../../f-connection';
import { IConnectorAndRect } from '../i-connector-and-rect';

@Injectable()
@FExecutionRegister(FindInputAtPositionRequest)
export class FindInputAtPositionExecution
  implements IExecution<FindInputAtPositionRequest, FConnectorBase | undefined> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fBrowser = inject(BrowserService);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private get _fNodes(): FNodeBase[] {
    return this._fComponentsStore.fNodes;
  }

  private get _fSnapConnection(): FSnapConnectionComponent | undefined {
    return this._fComponentsStore.fSnapConnection as FSnapConnectionComponent;
  }

  public handle(payload: FindInputAtPositionRequest): FConnectorBase | undefined {
    const fInputs = this._findInputsAtPosition(payload,);
    return fInputs.length > 0 ? fInputs[ 0 ] : undefined;
  }

  private _findInputsAtPosition(request: FindInputAtPositionRequest): FConnectorBase[] {
    const result: FConnectorBase[] = [];

    result.push(...this._getConnectableInputsAtPosition(request));

    const fClosestInput = this._calculateClosetInput(request);
    if (fClosestInput) {
      result.unshift(fClosestInput.fConnector);
    }

    const fInput = this._getFirstConnectableInputOfNodeAtPosition(request);
    if (fInput) {
      result.push(fInput);
    }

    return result;
  }

  private _getConnectableInputsAtPosition(request: FindInputAtPositionRequest): FConnectorBase[] {
    return request.canBeConnectedInputs.filter((x) => {
      return RectExtensions.isIncludePoint(x.fRect, this._getPointInFlow(request.pointerPosition));
    }).map((x) => x.fConnector);
  }

  private _getPointInFlow(position: IPoint): IPoint {
    return Point.fromPoint(position)
      .elementTransform(this._fHost)
      .sub(this._transform.scaledPosition).sub(this._transform.position)
      .div(this._transform.scale);
  }

  //if the closest input is valid, return it
  private _calculateClosetInput(request: FindInputAtPositionRequest): IClosestInput | undefined {
    if (!this._fSnapConnection) {
      return undefined;
    }

    const fClosestInput = this._fMediator.execute<IClosestInput | undefined>(
      new CalculateClosestInputRequest(this._getPointInFlow(request.pointerPosition), request.canBeConnectedInputs)
    );

    return this._isValidClosestInput(fClosestInput) ? fClosestInput : undefined;
  }

  private _isValidClosestInput(fClosestInput: IClosestInput | undefined): boolean {
    return !!fClosestInput && fClosestInput.distance < this._fSnapConnection!.fSnapThreshold;
  }

  //if node placed in position and fConnectOnNode is true, return the first connectable input of the node
  private _getFirstConnectableInputOfNodeAtPosition(request: FindInputAtPositionRequest): FConnectorBase | undefined {
    return this._getElementsFromPoint(request.pointerPosition)
      .map((x) => this._findConnectableNode(x))
      .filter((x) => !!x)
      .map((x) => this._findFirstConnectableInputOfNode(request.canBeConnectedInputs, x))
      .find((x) => !!x);
  }

  private _getElementsFromPoint(position: IPoint): HTMLElement[] {
    return this._fBrowser.document.elementsFromPoint(position.x, position.y) as HTMLElement[];
  }

  private _findConnectableNode(element: HTMLElement): FNodeBase | undefined {
    return this._fNodes.find((x) => x.isContains(element) && x.fConnectOnNode);
  }

  private _findFirstConnectableInputOfNode(connectableInputs: IConnectorAndRect[], fNode: FNodeBase): FConnectorBase | undefined {
    return connectableInputs.find((x) => x.fConnector.fNodeId === fNode.fId)?.fConnector
  }
}
