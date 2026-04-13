import {
  Component,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlowNodeValuePatch, FlowStateNode, NODE_PARAMS_MAP, NodeType } from '../../domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlowNodeHeader } from './flow-node-header/flow-node-header';
import { FlowNodeFooterOutputs } from './flow-node-footer-outputs/flow-node-footer-outputs';
import { FlowNodeBodyOutputs } from './flow-node-body-outputs/flow-node-body-outputs';
import { distinctUntilChanged } from 'rxjs';
import { FlowStore } from '../../store/flow-store';
import { FlowNodeIvrForm } from './flow-node-ivr-form/flow-node-ivr-form';
import { FlowNodePlayTextForm } from './flow-node-play-text-form/flow-node-play-text-form';
import { FlowNodeScheduleForm } from './flow-node-schedule-form/flow-node-schedule-form';
import { FlowNodeQueueForm } from './flow-node-queue-form/flow-node-queue-form';
import { FlowNodeOperatorForm } from './flow-node-operator-form/flow-node-operator-form';
import { FlowNodeTransferForm } from './flow-node-transfer-form/flow-node-transfer-form';
import { FlowNodeVoicemailForm } from './flow-node-voicemail-form/flow-node-voicemail-form';

@Component({
  selector: 'flow-node',
  templateUrl: './flow-node.html',
  styleUrls: ['./flow-node.scss'],
  standalone: true,
  imports: [
    FFlowModule,
    ReactiveFormsModule,
    FlowNodeHeader,
    FlowNodeFooterOutputs,
    FlowNodeBodyOutputs,
    FlowNodeIvrForm,
    FlowNodePlayTextForm,
    FlowNodeScheduleForm,
    FlowNodeQueueForm,
    FlowNodeOperatorForm,
    FlowNodeTransferForm,
    FlowNodeVoicemailForm,
  ],
  host: {
    '[class.invalid]': 'form.invalid && form.touched',
  },
})
export class FlowNode implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);
  private readonly _store = inject(FlowStore);

  public readonly viewModel = input.required<FlowStateNode>();

  public readonly removeConnection = output<string>();

  protected readonly form = new FormControl<FlowNodeValuePatch>(null);
  protected readonly defaultParams = NODE_PARAMS_MAP;
  protected readonly expanded = signal(false);

  protected readonly nodeType = NodeType;

  public ngOnInit(): void {
    this._listenViewModelChanges();
    this._listenToFormChanges();
  }

  private _listenToFormChanges(): void {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => this._isEqual(prev, curr)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this._store.updateNode(this.viewModel().id, { value });
      });
  }

  private _isEqual<TValue>(a: TValue, b: TValue): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private _listenViewModelChanges(): void {
    effect(
      () => {
        const viewModel = this.viewModel();
        untracked(() => {
          this.expanded.set(viewModel.isExpanded ?? false);
          this.form.setValue(viewModel.value, { emitEvent: false });
        });
      },
      { injector: this._injector },
    );
  }

  protected toggle(isExpanded: boolean): void {
    this._store.updateNode(this.viewModel().id, { isExpanded });
  }
}
