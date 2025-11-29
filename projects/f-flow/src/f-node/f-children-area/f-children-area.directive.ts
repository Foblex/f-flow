import { Directive, ElementRef, inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { F_NODE } from '../f-node-base';
import { IHasHostElement } from '../../i-has-host-element';

export const F_CHILDREN_AREA = new InjectionToken<FChildrenAreaDirective>('F_CHILDREN_AREA');

/**
 * Directive that marks a designated area within a Node or Group where children should be constrained.
 * Instead of using the node's padding to calculate children boundaries, this element's bounds
 * relative to the parent node will be used.
 *
 * @example
 * ```html
 * <div fNode fDragHandle [fNodeId]="node.id">
 *   <h4>Title that needs to be visible</h4>
 *   <div fChildrenArea class="children-area">
 *     <!-- This is the designated children area -->
 *   </div>
 *   <small>Footer content</small>
 * </div>
 * ```
 */
@Directive({
  selector: '[fChildrenArea]',
  host: {
    class: 'f-children-area f-component',
  },
  providers: [{ provide: F_CHILDREN_AREA, useExisting: FChildrenAreaDirective }],
})
export class FChildrenAreaDirective implements OnInit, OnDestroy, IHasHostElement {
  private readonly _elementReference = inject(ElementRef<HTMLElement>);
  private readonly _fNode = inject(F_NODE);

  public get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public ngOnInit(): void {
    this._fNode.setChildrenArea(this);
  }

  public ngOnDestroy(): void {
    this._fNode.setChildrenArea(null);
  }
}
