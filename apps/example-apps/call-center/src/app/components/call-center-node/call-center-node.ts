import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import { distinctUntilChanged } from 'rxjs';
import { CallCenterNodeRecord, CallCenterNodeValuePatch, ECallCenterNodeType } from '../../domain';
import { CallCenterFlowState } from '../../state';
import { CallCenterNodeHeader } from './call-center-node-header/call-center-node-header';
import { CallCenterIvrForm } from './call-center-ivr-form/call-center-ivr-form';
import { CallCenterOperatorForm } from './call-center-operator-form/call-center-operator-form';
import { CallCenterPlayTextForm } from './call-center-play-text-form/call-center-play-text-form';
import { CallCenterQueueForm } from './call-center-queue-form/call-center-queue-form';
import { CallCenterScheduleForm } from './call-center-schedule-form/call-center-schedule-form';
import { CallCenterTransferForm } from './call-center-transfer-form/call-center-transfer-form';
import { CallCenterVoicemailForm } from './call-center-voicemail-form/call-center-voicemail-form';

@Component({
  selector: 'call-center-node',
  templateUrl: './call-center-node.html',
  styleUrls: ['./call-center-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    ReactiveFormsModule,
    MatIcon,
    CallCenterNodeHeader,
    CallCenterIvrForm,
    CallCenterPlayTextForm,
    CallCenterScheduleForm,
    CallCenterQueueForm,
    CallCenterOperatorForm,
    CallCenterTransferForm,
    CallCenterVoicemailForm,
  ],
  host: {
    '[class.invalid]': 'form.invalid && form.touched',
  },
})
export class CallCenterNode implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);
  private readonly _state = inject(CallCenterFlowState);

  public readonly node = input.required<CallCenterNodeRecord>();

  protected readonly form = new FormControl<CallCenterNodeValuePatch>(null);
  protected readonly isExpanded = computed(() => this.node().isExpanded ?? false);
  protected readonly connectableSide = EFConnectableSide;
  protected readonly nodeType = ECallCenterNodeType;
  protected readonly connectedOutputIds = computed(() => {
    return new Set(this._state.connections().map((connection) => connection.sourceId));
  });

  public ngOnInit(): void {
    this._listenToNodeChanges();
    this._listenToFormChanges();
  }

  protected setExpanded(isExpanded: boolean): void {
    void this._state.setNodeExpanded(this.node().id, isExpanded);
  }

  protected removeOutputConnection(outputId: string): void {
    this._state.removeConnectionFromOutput(outputId);
  }

  private _listenToFormChanges(): void {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged((previous, current) => _areEqual(previous, current)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => this._state.updateNodeValue(this.node().id, value));
  }

  private _listenToNodeChanges(): void {
    effect(
      () => {
        const value = this.node().value;
        untracked(() => this.form.setValue(value, { emitEvent: false }));
      },
      { injector: this._injector },
    );
  }
}

function _areEqual<TValue>(left: TValue, right: TValue): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
