import {inject, Injectable} from '@angular/core';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {UpdateNodeWhenStateOrSizeChangedRequest} from './update-node-when-state-or-size-changed-request';
import {EFConnectableSide, FConnectorBase} from '../../../f-connectors';
import {FComponentsStore, NotifyDataChangedRequest} from '../../../f-storage';
import {debounceTime, FChannelHub, notifyOnStart} from '../../../reactivity';
import {FResizeChannel} from '../../../reactivity';
import {RectExtensions} from '@foblex/2d';
import {FitToChildNodesAndGroupsRequest} from "../fit-to-child-nodes-and-groups";
import {IsDragStartedRequest} from "../../f-draggable";
import {FNodeBase} from "../../../f-node";

/**
 * Execution that updates a node's connectors when its state or size changes.
 */
@Injectable()
@FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)
export class UpdateNodeWhenStateOrSizeChanged
  implements IExecution<UpdateNodeWhenStateOrSizeChangedRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _nodes(): FNodeBase[] {
    return this._store.fNodes;
  }

  /**
   * Handles the request to update the node's connectors based on state or size changes.
   * It listens for resize events and recalculates the connectable sides of the connectors.
   * @param request
   */
  public handle({nodeOrGroup, destroyRef}: UpdateNodeWhenStateOrSizeChangedRequest): void {
    const {hostElement, connectors, stateChanges} = nodeOrGroup;

    new FChannelHub(
      new FResizeChannel(hostElement),
      stateChanges
    ).pipe(notifyOnStart(), debounceTime(10)).listen(destroyRef, () => {
      this._calculateConnectorsConnectableSide(connectors, hostElement);
      this._mediator.execute<void>(new NotifyDataChangedRequest());

      if (!this._isDragging()) {
        const directParent = this._nodes.find(x => x.fId() === nodeOrGroup.fParentId());
        if (directParent) {
          this._mediator.execute<void>(new FitToChildNodesAndGroupsRequest(directParent));
        }
      }
    });
  }

  /**
   * Calculates the connectable side for each connector based on its position relative to the node host.
   * @param fConnectors
   * @param fNodeHost
   * @private
   */
  private _calculateConnectorsConnectableSide(fConnectors: FConnectorBase[], fNodeHost: HTMLElement | SVGElement): void {
    fConnectors.forEach((x: FConnectorBase) => {
      x.fConnectableSide = this._calculateConnectorConnectableSide(x, fNodeHost);
    });
  }

  /**
   * Calculates the connectable side of a connector based on its user-defined side or its position relative to the node host.
   * @param fConnector
   * @param fNodeHost
   * @returns {EFConnectableSide}
   * @private
   */
  private _calculateConnectorConnectableSide(fConnector: FConnectorBase, fNodeHost: HTMLElement | SVGElement): EFConnectableSide {
    let result: EFConnectableSide | undefined;

    if (fConnector.userFConnectableSide === EFConnectableSide.AUTO) {
      result = this._getSideByDelta(fConnector.hostElement, fNodeHost);
    } else {
      result = fConnector.userFConnectableSide;
    }
    return result;
  }

  /**
   * Determines the side of the connector relative to the node host based on the minimum distance.
   * @param fConnectorHost
   * @param fNodeHost
   * @private
   */
  private _getSideByDelta(fConnectorHost: HTMLElement | SVGElement, fNodeHost: HTMLElement | SVGElement): EFConnectableSide {
    let result: EFConnectableSide | undefined;

    const childRect = RectExtensions.fromElement(fConnectorHost);
    const parentRect = fNodeHost.getBoundingClientRect();

    const deltaLeft = childRect.gravityCenter.x - parentRect.left;
    const deltaRight = parentRect.right - childRect.gravityCenter.x;
    const deltaTop = childRect.gravityCenter.y - parentRect.top;
    const deltaBottom = parentRect.bottom - childRect.gravityCenter.y;

    const minDelta = Math.min(deltaLeft, deltaRight, deltaTop, deltaBottom);

    if (minDelta === deltaLeft) {
      result = EFConnectableSide.LEFT;
    } else if (minDelta === deltaRight) {
      result = EFConnectableSide.RIGHT;
    } else if (minDelta === deltaTop) {
      result = EFConnectableSide.TOP;
    } else {
      result = EFConnectableSide.BOTTOM;
    }

    return result;
  }

  private _isDragging(): boolean {
    return this._mediator.execute(new IsDragStartedRequest());
  }
}

