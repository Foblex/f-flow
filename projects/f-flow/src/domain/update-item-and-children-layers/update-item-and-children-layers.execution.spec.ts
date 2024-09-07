import { TestBed } from '@angular/core/testing';
import { UpdateItemAndChildrenLayersExecution } from './update-item-and-children-layers.execution';
import { UpdateItemAndChildrenLayersRequest } from './update-item-and-children-layers.request';
import { FFlowMediator } from '../../infrastructure';
import { setupTestModule } from '../test-setup';
import { ISelectable } from '../../f-connection';

function getSelectableItem(hostElement: HTMLElement): ISelectable {
  return {
    fId: '1',
    fSelectionDisabled: false,
    hostElement: hostElement,
    select: jasmine.createSpy('select'),
    deselect: jasmine.createSpy('deselect'),
    isSelected: jasmine.createSpy('isSelected').and.returnValue(true)
  }
}

function createElementWithId(id: string): HTMLElement {
  const element = document.createElement('div');
  element.id = id;
  return element;
}

describe('UpdateItemLayerExecution', () => {
  let fMediator: FFlowMediator;

  beforeEach(() => {
    setupTestModule([ UpdateItemAndChildrenLayersExecution ]);
    fMediator = TestBed.inject(FFlowMediator) as jasmine.SpyObj<FFlowMediator>;
  });

  it('should move TargetElement to last position in array', () => {
    const itemContainer = createElementWithId('itemContainer');
    const itemElement = createElementWithId('itemElement')
    const anotherElement = createElementWithId('anotherElement')
    const targetElement = createElementWithId('targetElement');

    itemContainer.appendChild(anotherElement);
    itemContainer.appendChild(targetElement);
    itemContainer.appendChild(itemElement);

    expect(itemContainer.children[ 1 ].id).toEqual('targetElement');

    fMediator.send(new UpdateItemAndChildrenLayersRequest(getSelectableItem(targetElement), itemContainer));

    expect(itemContainer.children[ 0 ].id).toEqual('anotherElement');
    expect(itemContainer.children[ 1 ].id).toEqual('itemElement');
    expect(itemContainer.children[ 2 ].id).toEqual('targetElement');
  });

  it('should do nothing if TargetElement is already the last element', () => {
    const itemContainer = createElementWithId('itemContainer');
    const anotherElement = createElementWithId('anotherElement')
    const targetElement = createElementWithId('targetElement');

    itemContainer.appendChild(anotherElement);
    itemContainer.appendChild(targetElement);

    expect(itemContainer.children[ 1 ].id).toEqual('targetElement');

    fMediator.send(new UpdateItemAndChildrenLayersRequest(getSelectableItem(targetElement), itemContainer));

    expect(itemContainer.children[ 0 ].id).toEqual('anotherElement');
    expect(itemContainer.children[ 1 ].id).toEqual('targetElement');
  });

  it('should handle empty item container', () => {
    const itemContainer = createElementWithId('itemContainer');
    const targetElement = createElementWithId('targetElement');

    fMediator.send(new UpdateItemAndChildrenLayersRequest(getSelectableItem(targetElement), itemContainer));

    expect(itemContainer.children.length).toBe(0);
  });

  it('should handle item not in container', () => {
    const itemContainer = createElementWithId('itemContainer');
    const anotherElement = createElementWithId('anotherElement')
    const targetElement = createElementWithId('targetElement');

    itemContainer.appendChild(anotherElement);

    fMediator.send(new UpdateItemAndChildrenLayersRequest(getSelectableItem(targetElement), itemContainer));

    expect(itemContainer.children.length).toBe(1);
    expect(itemContainer.children[ 0 ].id).toEqual('anotherElement');
  });
});
