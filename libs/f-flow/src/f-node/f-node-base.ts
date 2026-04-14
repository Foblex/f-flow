import {
  effect,
  inject,
  InjectionToken,
  Injector,
  InputSignal,
  ModelSignal,
  OutputEmitterRef,
  Renderer2,
  Signal,
  untracked,
} from '@angular/core';
import { IPoint, IRect, ISize, PointExtensions } from '@foblex/2d';
import { FConnectorBase } from '../f-connectors';
import { IHasHostElement } from '../i-has-host-element';
import { ISelectable, mixinChangeSelection } from '../mixins';
import { FChannel } from '../reactivity';
import { BrowserService } from '@foblex/platform';

export const F_NODE = new InjectionToken<FNodeBase>('F_NODE');

const MIXIN_BASE = mixinChangeSelection(
  class {
    constructor(public hostElement: HTMLElement) {}
  },
);

export abstract class FNodeBase extends MIXIN_BASE implements ISelectable, IHasHostElement {
  private readonly _injector = inject(Injector);

  protected readonly renderer = inject(Renderer2);
  protected readonly browser = inject(BrowserService);

  public abstract override fId: Signal<string>;

  public abstract fParentId: Signal<string | null | undefined>;

  public readonly stateChanges = new FChannel();

  public abstract position: ModelSignal<IPoint>;

  public _position = PointExtensions.initialize();

  public abstract rotate: ModelSignal<number>;

  public _rotate: number = 0;

  public abstract sizeChange: OutputEmitterRef<IRect>;

  public abstract size: InputSignal<ISize | undefined>;

  public _size: ISize | undefined;

  //Add ability to connect to first connectable input if node is at pointer position
  public abstract fConnectOnNode: Signal<boolean>;

  public abstract fMinimapClass: Signal<string[] | string>;

  public abstract fDraggingDisabled: Signal<boolean>;

  public abstract fAutoExpandOnChildHit: Signal<boolean>;

  public abstract fAutoSizeToFitChildren: Signal<boolean>;

  public abstract fIncludePadding: Signal<boolean>;

  public abstract refresh(): void;

  public connectors: FConnectorBase[] = [];

  protected positionChanges(): void {
    effect(
      () => {
        const position = this.position();
        untracked(() => {
          if (!PointExtensions.isEqual(this._position, position)) {
            this._position = position;
            this.redraw();
            this.refresh();
          }
        });
      },
      { injector: this._injector },
    );
  }

  protected sizeChanges(): void {
    effect(
      () => {
        const size = this.size();
        untracked(() => {
          if (!this._isSizeEqual(size)) {
            this._size = size;
            this.redraw();
            this.refresh();
          }
        });
      },
      { injector: this._injector },
    );
  }

  protected rotateChanges(): void {
    effect(
      () => {
        const rotate = this.rotate();
        untracked(() => {
          if (this._rotate !== rotate) {
            this._rotate = rotate;
            this.redraw();
            this.refresh();
          }
        });
      },
      { injector: this._injector },
    );
  }

  protected parentChanges(): void {
    effect(
      () => {
        this.fParentId();
        this.fIncludePadding();
        this.fAutoSizeToFitChildren();
        untracked(() => this.refresh());
      },
      { injector: this._injector },
    );
  }

  private _isSizeEqual(value?: ISize): boolean {
    return this._size?.width === value?.width && this._size?.height === value?.height;
  }

  protected abstract setStyle(name: string, value: string): void;

  protected abstract removeStyle(name: string): void;

  public isContains(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public redraw(): void {
    if (this._size) {
      this.setStyle('width', '' + this._size.width + 'px');
      this.setStyle('height', '' + this._size.height + 'px');
    }

    this.setStyle(
      'transform',
      `translate(${this._position.x}px,${this._position.y}px) rotate(${this._rotate}deg)`,
    );
  }

  public resetSize(): void {
    this.removeStyle('width');
    this.removeStyle('height');
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
