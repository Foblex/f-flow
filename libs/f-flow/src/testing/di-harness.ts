import { ElementRef, ModuleWithProviders, Provider, ProviderToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import { FComponentsStore } from '../f-storage';
import { FDraggableDataContext } from '../f-draggable';

class TestElementRef extends ElementRef<HTMLElement> {
  constructor() {
    super(document.createElement('div'));
  }
}

export interface DiTestConfig {
  declarations?: readonly Type<unknown>[];
  imports?: readonly (Type<unknown> | ModuleWithProviders<unknown>)[];
  providers?: readonly Provider[];
}

export function diBaseProviders(): Provider[] {
  return [
    FMediator,
    FComponentsStore,
    FDraggableDataContext,
    { provide: ElementRef, useClass: TestElementRef },
  ];
}

export function configureDiTest(config: DiTestConfig = {}): void {
  TestBed.configureTestingModule({
    declarations: [...(config.declarations ?? [])],
    imports: [...(config.imports ?? [])],
    providers: [...diBaseProviders(), ...(config.providers ?? [])],
  });
}

export function injectFromDi<T>(token: ProviderToken<T>): T {
  return TestBed.inject(token);
}

export function valueProvider<T>(token: ProviderToken<T>, value: T): Provider {
  return { provide: token, useValue: value };
}
