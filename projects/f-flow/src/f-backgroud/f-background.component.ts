import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild,
  ElementRef, OnDestroy,
  OnInit
} from "@angular/core";
import { F_BACKGROUND, FBackgroundBase } from './f-background-base';
import { ITransformModel } from '@foblex/2d';
import { AddPatternToBackgroundRequest, F_BACKGROUND_PATTERN, IFBackgroundPattern } from './domain';
import { FComponentsStore } from '../f-storage';
import { FMediator } from '@foblex/mediator';

let uniqueId: number = 0;

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
export class FBackgroundComponent extends FBackgroundBase implements OnInit, AfterContentInit, OnDestroy {

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @ContentChild(F_BACKGROUND_PATTERN, { static: false })
  public fBackgroundPattern: IFBackgroundPattern | undefined;

  constructor(
      private elementReference: ElementRef<HTMLElement>,
      private fComponentsStore: FComponentsStore,
      private fMediator: FMediator
  ) {
    super();
  }

  public ngOnInit(): void {
    this.fComponentsStore.fBackground = this;
  }

  public ngAfterContentInit(): void {
    this.fMediator.send(new AddPatternToBackgroundRequest(this.fBackgroundPattern!));
  }

  public override isBackgroundElement(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public setTransform(transform: ITransformModel): void {
    this.fBackgroundPattern?.setTransform(transform);
  }

  public ngOnDestroy() {
    this.fComponentsStore.fBackground = undefined;
  }
}
