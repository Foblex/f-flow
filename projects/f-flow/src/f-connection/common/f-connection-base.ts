import {Directive, ElementRef, InputSignal, signal, Signal} from '@angular/core';
import { ILine, IPoint, LineExtensions, PointExtensions } from '@foblex/2d';
import { EFConnectionBehavior } from './e-f-connection-behavior';
import { EFConnectionType } from './e-f-connection-type';
import { IHasConnectionColor } from './i-has-connection-color';
import { IHasConnectionFromTo } from './i-has-connection-from-to';
import { IHasConnectionText } from './i-has-connection-text';
import { IConnectionPath } from './f-path';
import { IConnectionGradient } from './f-gradient';
import {FConnectionDragHandleEndComponent, FConnectionDragHandleStartComponent} from './f-drag-handle';
import { FConnectionSelectionComponent } from './f-selection';
import { IConnectionText } from './f-connection-text';
import { EFConnectableSide } from '../../f-connectors';
import { FConnectionFactory } from '../f-connection-builder';
import { IHasHostElement } from '../../i-has-host-element';
import {
  ISelectable, ICanChangeVisibility,
  mixinChangeSelection, mixinChangeVisibility
} from '../../mixins';

const MIXIN_BASE = mixinChangeSelection(
  mixinChangeVisibility(
    class {
      constructor(
        public hostElement: HTMLElement
      ) {
      }
    }));

@Directive()
export abstract class FConnectionBase extends MIXIN_BASE
  implements IHasHostElement, ISelectable,
             ICanChangeVisibility,
             IHasConnectionColor,
             IHasConnectionFromTo, IHasConnectionText {

  public abstract override fId: Signal<string>;

  public abstract fStartColor: InputSignal<string>;

  public abstract fEndColor: InputSignal<string>;

  public abstract fOutputId: string;

  public abstract fInputId: string;

  public abstract fRadius: number;

  public abstract fOffset: number;

  public path: string = '';

  public line: ILine = LineExtensions.initialize();

  public abstract fDraggingDisabled: boolean;

  public abstract override fSelectionDisabled: boolean;

  public abstract boundingElement: HTMLElement | SVGElement;

  public abstract fBehavior: EFConnectionBehavior;

  public abstract fType: EFConnectionType | string;

  public fReassignableStart: Signal<boolean> = signal(false);

  public abstract fDefs: Signal<ElementRef<SVGDefsElement>>;

  public abstract fPath: Signal<IConnectionPath>;

  public abstract fGradient: Signal<IConnectionGradient>;

  public abstract fDragHandleEnd: Signal<FConnectionDragHandleEndComponent>;
  public abstract fDragHandleStart: Signal<FConnectionDragHandleStartComponent>;

  public abstract fSelection: Signal<FConnectionSelectionComponent>;

  public abstract fTextComponent: Signal<IConnectionText>;

  public abstract fText: string;

  public abstract fTextStartOffset: string;

  public abstract fConnectionCenter: Signal<ElementRef<HTMLDivElement> | undefined>;

  private penultimatePoint: IPoint = PointExtensions.initialize();
  private secondPoint: IPoint = PointExtensions.initialize();

  protected constructor(
    elementReference: ElementRef<HTMLElement>,
    private cFactory: FConnectionFactory
  ) {
    super(elementReference.nativeElement);
  }

  public initialize(): void {
    this.fPath().initialize();
    this.fGradient().initialize();
    this.redraw();
  }

  public isContains(element: HTMLElement | SVGElement): boolean {
    return (this.hostElement.firstChild?.lastChild as HTMLElement).contains(element);
  }

  public setLine({ point1, point2 }: ILine, sourceSide: EFConnectableSide, targetSide: EFConnectableSide): void {
    this.line = LineExtensions.initialize(point1, point2);
    const pathResult = this.getPathResult(point1, sourceSide, point2, targetSide);
    this.path = pathResult.path;
    this.penultimatePoint = pathResult.penultimatePoint || point1;
    this.secondPoint = pathResult.secondPoint || point2;
    this.fConnectionCenter()?.nativeElement?.setAttribute('style', this.getTransform(pathResult.connectionCenter));
  }

  private getPathResult(source: IPoint, sourceSide: EFConnectableSide, target: IPoint, targetSide: EFConnectableSide): any {
    const radius = this.fRadius > 0 ? this.fRadius : 0;
    const offset = this.fOffset > 0 ? this.fOffset : 1;
    return this.cFactory.handle(
      {
        type: this.fType,
        payload: { source, sourceSide, target, targetSide, radius, offset }
      }
    );
  }

  private getTransform(position: IPoint): string {
    return `position: absolute; pointerEvents: all; transform: translate(-50%, -50%); left: ${ position.x }px; top: ${ position.y }px`;
  }

  public override markChildrenAsSelected(): void {
    this.fPath().select();
  }

  public override unmarkChildrenAsSelected(): void {
    this.fPath().deselect();
  }

  public redraw(): void {
    this.fPath().setPath(this.path);
    this.fSelection().setPath(this.path);
    this.fGradient().redraw(this.line);
    this.fDragHandleEnd().redraw(this.penultimatePoint, this.line.point2);
    this.fDragHandleStart().redraw(this.secondPoint, this.line.point1);
    this.fTextComponent().redraw(this.line);
  }
}
