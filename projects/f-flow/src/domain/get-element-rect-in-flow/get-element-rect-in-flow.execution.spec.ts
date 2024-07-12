import { TestBed } from '@angular/core/testing';
import { GetElementRectInFlowExecution } from './get-element-rect-in-flow.execution';
import { GetElementRectInFlowRequest } from './get-element-rect-in-flow-request';
import { FComponentsStore } from '../../f-storage';
import { IRoundedRect, RoundedRect } from '../intersections';
import { FFlowMediator } from '../../infrastructure';
import { setupTestModule } from '../test-setup';
import { FFlowComponent } from '../../f-flow';
import { FCanvasComponent } from '../../f-canvas';

describe('GetElementRectInFlowExecution', () => {
  let fMediator: FFlowMediator;
  let fComponentsStore: jasmine.SpyObj<FComponentsStore>;

  beforeEach(() => {
    setupTestModule([ GetElementRectInFlowExecution ], [ FFlowComponent, FCanvasComponent ]);
    fMediator = TestBed.inject(FFlowMediator) as jasmine.SpyObj<FFlowMediator>;
    fComponentsStore = TestBed.inject(FComponentsStore) as jasmine.SpyObj<FComponentsStore>;
    fComponentsStore.fFlow = TestBed.createComponent(FFlowComponent).componentInstance;
    fComponentsStore.fCanvas = TestBed.createComponent(FCanvasComponent).componentInstance;
  });

  it('should handle the request correctly', () => {
    const element = document.createElement('div');
    spyOn(RoundedRect, 'fromElement').and.returnValue(new RoundedRect(10, 10, 200, 100, 10, 10, 10, 10));

    const result = fMediator.send<IRoundedRect>(new GetElementRectInFlowRequest(element));

    expect(result.x).toBe(10);
    expect(result.y).toBe(10);
    expect(result.width).toBe(200);
    expect(result.height).toBe(100);
    expect(result.radius1).toBe(10);
    expect(result.radius2).toBe(10);
    expect(result.radius3).toBe(10);
    expect(result.radius4).toBe(10);
  });
});
