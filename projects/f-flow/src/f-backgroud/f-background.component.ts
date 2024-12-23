import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild,
  ElementRef, inject, OnDestroy,
  OnInit
} from "@angular/core";
import { F_BACKGROUND, FBackgroundBase } from './f-background-base';
import { ITransformModel } from '@foblex/2d';
import { F_BACKGROUND_PATTERN, IFBackgroundPattern } from './domain';
import { FMediator } from '@foblex/mediator';
import {
  AddBackgroundToStoreRequest,
  AddPatternToBackgroundRequest,
  RemoveBackgroundFromStoreRequest
} from '../domain';

@Component({
  selector: "f-background",
  template: "<svg><ng-content></ng-content></svg>",
  styleUrls: [ "./f-background.component.scss" ],
  host: {
    'class': 'f-component f-background'
  },
  providers: [ { provide: F_BACKGROUND, useExisting: FBackgroundComponent } ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FBackgroundComponent
  extends FBackgroundBase implements OnInit, AfterContentInit, OnDestroy {

  private _elementReference = inject(ElementRef);

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @ContentChild(F_BACKGROUND_PATTERN, { static: false })
  public fBackgroundPattern: IFBackgroundPattern | undefined;

  private _fMediator = inject(FMediator);

  public ngOnInit(): void {
    this._fMediator.send(new AddBackgroundToStoreRequest(this));
  }

  public ngAfterContentInit(): void {
    this._fMediator.send(new AddPatternToBackgroundRequest(this.fBackgroundPattern!));
  }

  public setTransform(transform: ITransformModel): void {
    this.fBackgroundPattern?.setTransform(transform);
  }

  public ngOnDestroy() {
    this._fMediator.send(new RemoveBackgroundFromStoreRequest(this));
  }
}
