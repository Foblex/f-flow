import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild,
  ElementRef, OnDestroy,
  OnInit
} from "@angular/core";
import { F_BACKGROUND, FBackgroundBase } from './f-background-base';
import { DomElementExtensions, ITransformModel, TransformModelExtensions } from '@foblex/core';
import { F_BACKGROUND_PATTERN } from './domain';
import { FComponentsStore } from '../f-storage';

let uniqueId: number = 0;

@Component({
  selector: "f-background",
  templateUrl: "./f-background.component.html",
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

  @ContentChild(F_BACKGROUND_PATTERN, { static: true })
  public fBackgroundPattern: FBackgroundBase | undefined;

  constructor(
      private elementReference: ElementRef<HTMLElement>,
      private fComponentsStore: FComponentsStore
  ) {
    super();
  }

  public ngOnInit(): void {
    this.fComponentsStore.fBackground = this;
  }

  public ngAfterContentInit(): void {
    const children = this.fBackgroundPattern?.hostElement.getElementsByTagName('pattern') || [];
    const pattern = children.length ? children[ 0 ] : undefined;
    if (pattern) {
      const defs = DomElementExtensions.createSvgElement('defs');
      pattern.id = 'f-background-marker-' + uniqueId++;
      this.fBackgroundPattern?.hostElement.remove();
      defs.appendChild(pattern);
      this.hostElement?.firstChild?.appendChild(defs);
      const rect = DomElementExtensions.createSvgElement('rect');
      rect.setAttribute('fill', 'url(#' + pattern.id + ')');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      this.hostElement.firstChild?.appendChild(rect);
      const transform = this.fComponentsStore.fCanvas?.transform || TransformModelExtensions.default();
      this.fBackgroundPattern?.setTransform(transform);
    }
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
