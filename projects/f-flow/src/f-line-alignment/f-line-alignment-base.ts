import { Directive, InjectionToken, InputSignalWithTransform } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';

export const F_LINE_ALIGNMENT = new InjectionToken<FLineAlignmentBase>('F_LINE_ALIGNMENT');

@Directive()
export abstract class FLineAlignmentBase implements IHasHostElement {

  public abstract hostElement: HTMLElement;

  public abstract fAlignThreshold: InputSignalWithTransform<number, unknown>;
}
