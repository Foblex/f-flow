import { Directive, ElementRef } from '@angular/core';
import {
  IHasHostElement,
  IPoint,
  IVector,
  VectorExtensions
} from '@foblex/core';
import { Subject } from 'rxjs';
import { EFConnectionBehavior } from './e-f-connection-behavior';
import { EFConnectionType } from './e-f-connection-type';
import { IHasConnectionColor } from './i-has-connection-color';
import { IHasConnectionFromTo } from './i-has-connection-from-to';
import { IHasConnectionText } from './i-has-connection-text';
import { IConnectionPath } from './f-path';
import { IConnectionGradient } from './f-gradient';
import { FConnectionDragHandleComponent } from './f-drag-handle';
import { FConnectionSelectionComponent } from './f-selection';
import { IConnectionText } from './f-connection-text';
import { IHasStateChanges } from '../../i-has-state-changes';
import { FMarkerBase } from '../f-marker';
import { EFConnectableSide } from '../../f-connectors';
import { FConnectionFactory } from '../f-connection-builder';
import {
  ICanChangeConnectionVisibility,
  ISelectable,
  mixinChangeConnectionSelection,
  mixinChangeConnectionVisibility
} from './mixins';

const MIXIN_BASE = mixinChangeConnectionSelection(
  mixinChangeConnectionVisibility(
    class {
      constructor(
        public hostElement: HTMLElement
      ) {
      }
    }));

@Directive()
export abstract class FConnectionBase extends MIXIN_BASE
  implements IHasHostElement, ISelectable,
             ICanChangeConnectionVisibility,
             IHasStateChanges, IHasConnectionColor,
             IHasConnectionFromTo, IHasConnectionText {

  public abstract fConnectionId: string;

  public abstract fStartColor: string;

  public abstract fEndColor: string;

  public abstract fOutputId: string;

  public abstract fInputId: string;

  public abstract fRadius: number;

  public abstract fOffset: number;

  public path: string = '';

  public vector: IVector = VectorExtensions.initialize();

  public readonly stateChanges: Subject<void> = new Subject<void>();

  public abstract fDraggingDisabled: boolean;

  public abstract override fSelectionDisabled: boolean;

  public abstract boundingElement: HTMLElement | SVGElement;

  public abstract fBehavior: EFConnectionBehavior;

  public abstract fType: EFConnectionType;

  public abstract fDefs: ElementRef<SVGDefsElement>;

  public abstract fMarkers: FMarkerBase[];

  public abstract fPath: IConnectionPath;

  public abstract fGradient: IConnectionGradient;

  public abstract fDragHandle: FConnectionDragHandleComponent;

  public abstract fSelection: FConnectionSelectionComponent;

  public abstract fTextComponent: IConnectionText;

  public abstract fText: string;

  public abstract fConnectionCenter: ElementRef<HTMLDivElement>;

  protected constructor(
    elementReference: ElementRef<HTMLElement>,
    private connectionFactory: FConnectionFactory
  ) {
    super(elementReference.nativeElement);
  }

  public initialize(): void {
    this.fPath.initialize();
    this.fGradient.initialize();
    this.redraw();
  }

  public isContains(element: HTMLElement | SVGElement): boolean {
    return (this.hostElement.firstChild?.lastChild as HTMLElement).contains(element);
  }

  public setVector(source: IPoint, sourceSide: EFConnectableSide, target: IPoint, targetSide: EFConnectableSide): void {
    this.vector = VectorExtensions.initialize(source, target);
    const radius = this.fRadius > 0 ? this.fRadius : 0;
    const offset = this.fOffset > 0 ? this.fOffset : 1;
    const pathResult = this.connectionFactory.handle(
      {
        type: this.fType,
        payload: { source, sourceSide, target, targetSide, radius, offset }
      }
    );

    this.path = pathResult.path;

    const transform = `position: absolute; pointerEvents: all; transform: translate(-50%, -50%); left: ${ pathResult.connectionCenter.x }px; top: ${ pathResult.connectionCenter.y }px`;

    this.fConnectionCenter?.nativeElement?.setAttribute('style', transform);
  }

  public redraw(): void {
    this.fPath.setPath(this.path);
    this.fSelection.setPath(this.path);
    this.fGradient.redraw(this.vector);
    this.fDragHandle.redraw(this.vector.point2);
    this.fTextComponent.redraw(this.vector);
  }
}
