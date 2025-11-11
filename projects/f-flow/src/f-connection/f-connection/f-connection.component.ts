import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  viewChildren,
} from '@angular/core';
import {
  EFConnectionBehavior,
  EFConnectionConnectableSide,
  EFConnectionType,
  FConnectionDragHandleControlPointComponent,
} from '../common';
import { NotifyDataChangedRequest } from '../../f-storage';
import { F_CONNECTION } from '../common/f-connection.injection-token';
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddConnectionToStoreRequest, RemoveConnectionFromStoreRequest } from '../../domain';
import { stringAttribute } from '../../utils';

let uniqueId = 0;

@Component({
  selector: 'f-connection',
  exportAs: 'fComponent',
  templateUrl: './f-connection.component.html',
  styleUrls: ['./f-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'fId()',
    class: 'f-component f-connection',
    '[class.f-connection-selection-disabled]': 'fSelectionDisabled()',
    '[class.f-connection-reassign-disabled]': 'fDraggingDisabled()',
  },
  providers: [{ provide: F_CONNECTION, useExisting: FConnectionComponent }],
})
export class FConnectionComponent extends FConnectionBase implements OnInit, OnChanges, OnDestroy {
  public override fId = input<string>(`f-connection-${uniqueId++}`, { alias: 'fConnectionId' });

  /** @deprecated [fText] is deprecated and will be removed in v18.0.0. Use FConnectionContent directive instead. */
  @Input()
  public override fText: string = '';

  /** @deprecated [fTextStartOffset] is deprecated and will be removed in v18.0.0. Use FConnectionContent directive instead. */
  @Input()
  public override fTextStartOffset: string = '';

  public override fOutputId = input<string, unknown>('', {
    transform: (value) => stringAttribute(value) || '',
  });

  public override fInputId = input<string, unknown>('', {
    transform: (value) => stringAttribute(value) || '',
  });

  @Input({ transform: numberAttribute })
  public override fRadius: number = 8;

  @Input({ transform: numberAttribute })
  public override fOffset: number = 12;

  @Input({ transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior) })
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

  @Input()
  public override fControlPoints: { x: number; y: number }[] = [];

  public override fSelectionDisabled = input(false, { transform: booleanAttribute });

  public override fReassignableStart = input(false, { transform: booleanAttribute });

  public override fDraggingDisabled = input(false, {
    alias: 'fReassignDisabled',
    transform: booleanAttribute,
  });

  public override fInputSide = input(EFConnectionConnectableSide.DEFAULT, {
    transform: (x) => {
      return castToEnum(x, 'fInputSide', EFConnectionConnectableSide);
    },
  });

  public override fOutputSide = input(EFConnectionConnectableSide.DEFAULT, {
    transform: (x) => {
      return castToEnum(x, 'fOutputSide', EFConnectionConnectableSide);
    },
  });

  public override get boundingElement(): HTMLElement | SVGElement {
    return this.fPath().hostElement;
  }

  private readonly _mediator = inject(FMediator);

  public readonly fDragHandleControlPoints = viewChildren(
    FConnectionDragHandleControlPointComponent,
  );

  public readonly controlPointsToRender = computed(() => {
    // Only render control points for custom-path connections
    if (this.fType !== EFConnectionType.CUSTOM_PATH) {
      return [];
    }
    return this.fControlPoints;
  });

  public override redraw(): void {
    super.redraw();
    // Redraw control point handles for custom-path connections
    if (this.fType === EFConnectionType.CUSTOM_PATH) {
      this._redrawControlPointHandles();
    }
  }

  private _redrawControlPointHandles(): void {
    const handles = this.fDragHandleControlPoints();
    const controlPoints = this.fControlPoints;

    handles.forEach((handle, index) => {
      if (index < controlPoints.length) {
        handle.redraw(controlPoints[index]);
      }
    });
  }

  public ngOnInit(): void {
    this._mediator.execute(new AddConnectionToStoreRequest(this));
  }

  public ngOnChanges(): void {
    this._mediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveConnectionFromStoreRequest(this));
  }
}
