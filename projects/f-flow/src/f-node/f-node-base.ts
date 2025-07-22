import {EventEmitter, InjectionToken, Signal} from '@angular/core';
import { IPoint, IRect, ISize, PointExtensions } from '@foblex/2d';
import {
  FConnectorBase
} from '../f-connectors';
import { IHasHostElement } from '../i-has-host-element';
import { ISelectable, mixinChangeSelection } from '../mixins';
import { FChannel } from '../reactivity';

export const F_NODE = new InjectionToken<FNodeBase>('F_NODE');

const MIXIN_BASE = mixinChangeSelection(
  class {
    constructor(
      public hostElement: HTMLElement
    ) {
    }
  });

export abstract class FNodeBase extends MIXIN_BASE implements ISelectable, IHasHostElement {

  public abstract override fId: Signal<string>;

  public abstract fParentId: string | null | undefined;

  public readonly stateChanges = new FChannel();


  public abstract positionChange: EventEmitter<IPoint>;

  public abstract position: IPoint;

  protected _position: IPoint = PointExtensions.initialize();


  public abstract rotateChange: EventEmitter<number>;

  public abstract rotate: number;

  protected _rotate: number = 0;


  public abstract sizeChange: EventEmitter<IRect>;

  public abstract size: ISize;

  protected _size: ISize | undefined;


  public abstract fMinimapClass: string[] | string;


  public abstract fDraggingDisabled: boolean;

  public abstract override fSelectionDisabled: boolean;

  public abstract fConnectOnNode: boolean;

  public fCanBeResizedByChild: boolean = true;

  public abstract fIncludePadding: boolean;

  public abstract refresh(): void;

  public connectors: FConnectorBase[] = [];

  protected abstract setStyle(name: string, value: string): void;

  public isContains(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public redraw(): void {
    if (this.size) {
      this.setStyle('width', '' + this.size.width + 'px');
      this.setStyle('height', '' + this.size.height + 'px');
    }

    this.setStyle('transform', `translate(${ this.position.x }px,${ this.position.y }px) rotate(${ this.rotate }deg)`);
  }

  public updatePosition(position: IPoint): void {
    this._position = position;
  }

  public updateRotate(rotate: number): void {
    this._rotate = rotate;
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

  public addConnector(connector: FConnectorBase): void {
    this.connectors.push(connector);
    this.refresh();
  }

  public removeConnector(connector: FConnectorBase): void {
    const index = this.connectors.indexOf(connector);
    if (index !== -1) {
      this.connectors.splice(index, 1);
    }
    this.refresh();
  }
}
