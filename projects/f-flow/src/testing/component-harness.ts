import { ModuleWithProviders, Provider, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { diBaseProviders } from './di-harness';

export interface ComponentTestConfig {
  declarations?: readonly Type<unknown>[];
  imports?: readonly (Type<unknown> | ModuleWithProviders<unknown>)[];
  providers?: readonly Provider[];
  detectChanges?: boolean;
}

export async function configureComponentTest<T>(
  component: Type<T>,
  config: ComponentTestConfig = {},
): Promise<ComponentFixture<T>> {
  TestBed.configureTestingModule({
    declarations: [component, ...(config.declarations ?? [])],
    imports: [...(config.imports ?? [])],
    providers: [...diBaseProviders(), ...(config.providers ?? [])],
  });

  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(component);
  if (config.detectChanges !== false) {
    fixture.detectChanges();
  }

  return fixture;
}
