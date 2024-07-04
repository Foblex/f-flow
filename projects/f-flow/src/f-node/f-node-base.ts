import { EventEmitter, InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { IHasHostElement, IPoint, IRect, ISize, PointExtensions } from '@foblex/core';
import { F_SELECTED_CLASS, ISelectable } from '../f-connection';
import { IHasStateChanges } from '../i-has-state-changes';
import { FConnectorBase } from '../f-connectors';

export const F_NODE = new InjectionToken<FNodeBase>('F_NODE');

export abstract class FNodeBase implements IHasStateChanges, ISelectable, IHasHostElement {

  public abstract fId: string;

  public abstract hostElement: HTMLElement;

  public readonly stateChanges: Subject<void> = new Subject<void>();


  public abstract positionChange: EventEmitter<IPoint>;

  public abstract position: IPoint;

  protected _position: IPoint = PointExtensions.initialize();


  public abstract sizeChange: EventEmitter<IRect>;

  public abstract size: ISize;

  protected _size: ISize | undefined;


  public abstract fDraggingDisabled: boolean;

  public abstract fSelectionDisabled: boolean;

  public abstract fConnectOnNode: boolean;

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

  public deselect(): void {
    this.hostElement.classList.remove(F_SELECTED_CLASS);
  }

  public select(): void {
    this.hostElement.classList.add(F_SELECTED_CLASS);
  }

  public isSelected(): boolean {
    return this.hostElement.classList.contains(F_SELECTED_CLASS);
  }

  public updatePosition(position: IPoint): void {
    this._position = position;
  }

  public updateSize(value: ISize): void {
    this._size = value;
  }
}
