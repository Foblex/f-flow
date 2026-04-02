import { Directive, ElementRef, inject, InputSignalWithTransform } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';

@Directive()
export abstract class FAutoPanBase implements IHasHostElement {
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  public abstract fEdgeThreshold: InputSignalWithTransform<number, unknown>;

  public abstract fSpeed: InputSignalWithTransform<number, unknown>;

  public abstract fAcceleration: InputSignalWithTransform<boolean, unknown>;
}
