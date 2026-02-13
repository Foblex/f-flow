import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, contentChild,
  ElementRef, inject, OnDestroy,
  OnInit,
} from "@angular/core";
import { F_BACKGROUND, FBackgroundBase } from './f-background-base';
import { ITransformModel } from '@foblex/2d';
import { F_BACKGROUND_PATTERN } from './domain';
import { FMediator } from '@foblex/mediator';
import {
  AddPatternToBackgroundRequest,
} from '../domain';
import {
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';

@Component({
  selector: "f-background",
  template: "<svg><ng-content></ng-content></svg>",
  styleUrls: [ "./f-background.component.scss" ],
  standalone: true,
  host: {
    'class': 'f-component f-background',
  },
  providers: [ { provide: F_BACKGROUND, useExisting: FBackgroundComponent } ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FBackgroundComponent
  extends FBackgroundBase implements OnInit, AfterContentInit, OnDestroy {

  private readonly _mediator = inject(FMediator);
  private readonly _elementReference = inject(ElementRef);

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  protected fBackgroundPattern = contentChild(F_BACKGROUND_PATTERN);

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.BACKGROUND, this));
  }

  public ngAfterContentInit(): void {
    this._mediator.execute(new AddPatternToBackgroundRequest(this.fBackgroundPattern()));
  }

  public setTransform(transform: ITransformModel): void {
    this.fBackgroundPattern()?.setTransform(transform);
  }

  public ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.BACKGROUND));
  }
}
