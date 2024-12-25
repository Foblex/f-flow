import { EventEmitter, InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { IPoint, IRect, ISize, PointExtensions } from '@foblex/2d';
import { IHasStateChanges } from '../i-has-state-changes';
import {
  CalculateConnectorConnectableSideHandler,
  CalculateConnectorConnectableSideRequest,
  FConnectorBase
} from '../f-connectors';
import { IHasHostElement } from '../i-has-host-element';
import { ICanChangeSelection, mixinChangeSelection } from '../mixins';
import { FDropToGroupEvent } from '../f-draggable';

export const F_NODE = new InjectionToken<FNodeBase>('F_NODE');

const MIXIN_BASE = mixinChangeSelection(
    class {
      constructor(
        public hostElement: HTMLElement
      ) {
      }
    });

export abstract class FNodeBase extends MIXIN_BASE implements IHasStateChanges, ICanChangeSelection, IHasHostElement {

  public abstract override fId: string;

  public abstract fParentId: string | null | undefined;

  public readonly stateChanges: Subject<void> = new Subject<void>();


  public abstract positionChange: EventEmitter<IPoint>;

  public abstract position: IPoint;

  protected _position: IPoint = PointExtensions.initialize();


  public abstract sizeChange: EventEmitter<IRect>;

  public abstract size: ISize;

  protected _size: ISize | undefined;


  public abstract fDraggingDisabled: boolean;

  public abstract override fSelectionDisabled: boolean;

  public abstract fConnectOnNode: boolean;

  public fCanBeResizedByChild: boolean = true;

  public abstract fIncludePadding: boolean;

  public abstract refresh(): void;

  public abstract connectors: FConnectorBase[];

  public abstract addConnector(connector: FConnectorBase): void;

  public abstract removeConnector(connector: FConnectorBase): void;

  protected abstract setStyle(name: string, value: string): void;

  public isContains(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public redraw(): void {
    if (this.size) {
      this.setStyle('width', '' + this.size.width + 'px');
      this.setStyle('height', '' + this.size.height + 'px');
    }

    this.setStyle('transform', `translate(${ this.position.x }px,${ this.position.y }px)`);
  }

  public updatePosition(position: IPoint): void {
    this._position = position;
  }

  public updateSize(value: ISize): void {
    this._size = value;
  }

  public setClass(className: string): void {
    this.hostElement.classList.add(className);
  }

  public removeClass(className: string): void {
    this.hostElement.classList.remove(className);
  }

  public calculateConnectorsSides(): void {
    this.connectors.forEach((fConnector: FConnectorBase) => {
      fConnector.fConnectableSide = new CalculateConnectorConnectableSideHandler().handle(
        new CalculateConnectorConnectableSideRequest(fConnector, this.hostElement)
      );
    });
  }
}
