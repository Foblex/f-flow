import { TestBed } from '@angular/core/testing';
import { FFlowMediator } from '../infrastructure';
import { ElementRef, Injector } from '@angular/core';
import { FComponentsStore } from '../f-storage';
import { ISelectable } from '../f-connection';

export class MockElementRef extends ElementRef<HTMLElement> {
  constructor() {
    super(document.createElement('div'));
  }
}

export function setupTestModule(providers: any[] = []): void {
  TestBed.configureTestingModule({
    providers: [
      FFlowMediator,
      FComponentsStore,
      { provide: ElementRef, useClass: MockElementRef },
      Injector,
      ...providers
    ]
  });
}

export const MOCK_SELECTABLE_ITEM: ISelectable = {
  fSelectionDisabled: false,
  hostElement: document.createElement('svg'),
  select: jasmine.createSpy('select'),
  deselect: jasmine.createSpy('deselect'),
  isSelected: jasmine.createSpy('isSelected').and.returnValue(true)
};
