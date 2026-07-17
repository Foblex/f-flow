import { Component, DestroyRef, inject, Type, viewChild, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DynamicComponentsStore } from '../../dynamic-components.store';
import { IDynamicComponentInstance } from '../../models';
import { RenderDynamicComponent } from './render-dynamic-component';
import { RenderDynamicComponentRequest } from './render-dynamic-component-request';

@Component({
  standalone: true,
  template: '<ng-container #container />',
})
class TestHost {
  public readonly viewContainerRef = viewChild.required('container', { read: ViewContainerRef });
}

@Component({
  standalone: true,
  template: '',
})
class TestLazyComponent {
  private readonly _destroyRef = inject(DestroyRef);

  public constructor() {
    this._destroyRef.onDestroy(() => undefined);
  }
}

describe('RenderDynamicComponent', () => {
  let execution: RenderDynamicComponent;
  let store: DynamicComponentsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicComponentsStore, RenderDynamicComponent],
    });

    execution = TestBed.inject(RenderDynamicComponent);
    store = TestBed.inject(DynamicComponentsStore);
  });

  it('does not create a lazy component after its host view is destroyed', async () => {
    const deferred = _createDeferred<Type<TestLazyComponent>>();
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const viewContainerRef = fixture.componentInstance.viewContainerRef();
    const createComponent = spyOn(viewContainerRef, 'createComponent').and.callThrough();
    spyOn(console, 'error');

    execution.handle(
      new RenderDynamicComponentRequest(
        {
          selector: 'test-lazy-component',
          component: deferred.promise as unknown as Promise<Type<IDynamicComponentInstance>>,
        },
        viewContainerRef,
      ),
    );

    fixture.destroy();
    deferred.resolve(TestLazyComponent);
    await deferred.promise;
    await Promise.resolve();

    expect(createComponent).not.toHaveBeenCalled();
  });

  it('does not create a lazy component from a disposed render generation', async () => {
    const deferred = _createDeferred<Type<TestLazyComponent>>();
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const viewContainerRef = fixture.componentInstance.viewContainerRef();
    const createComponent = spyOn(viewContainerRef, 'createComponent').and.callThrough();

    execution.handle(
      new RenderDynamicComponentRequest(
        {
          selector: 'test-lazy-component',
          component: deferred.promise as unknown as Promise<Type<IDynamicComponentInstance>>,
        },
        viewContainerRef,
      ),
    );

    store.dispose();
    deferred.resolve(TestLazyComponent);
    await deferred.promise;
    await Promise.resolve();

    expect(createComponent).not.toHaveBeenCalled();
  });

  it('creates a lazy component while its render generation is current', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const viewContainerRef = fixture.componentInstance.viewContainerRef();
    const createComponent = spyOn(viewContainerRef, 'createComponent').and.callThrough();

    execution.handle(
      new RenderDynamicComponentRequest(
        {
          selector: 'test-lazy-component',
          component: Promise.resolve(
            TestLazyComponent as unknown as Type<IDynamicComponentInstance>,
          ),
        },
        viewContainerRef,
      ),
    );

    await Promise.resolve();

    expect(createComponent).toHaveBeenCalledTimes(1);
    expect(viewContainerRef.length).toBe(1);
  });
});

function _createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}
