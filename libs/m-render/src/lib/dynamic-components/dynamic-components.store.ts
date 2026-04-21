import { ComponentRef, Injectable } from '@angular/core';
import { IDynamicComponentInstance } from './models';

@Injectable()
export class DynamicComponentsStore {
  private _components: ComponentRef<IDynamicComponentInstance>[] = [];

  public dispose(): void {
    this._components.forEach((ref) => ref.destroy());
    this._components = [];
  }

  public addComponent(reference: ComponentRef<IDynamicComponentInstance>, element?: HTMLElement): void {
    this._components.push(reference);

    this._assignInputs(reference, element);
    reference.instance?.initialize?.();
  }

  private _assignInputs(componentRef: ComponentRef<IDynamicComponentInstance>, element?: HTMLElement): void {
    const dataset = element?.dataset;
    if (!dataset) return;

    Object.entries(dataset).forEach(([key, rawValue]) => {
      const value = this._parseDatasetValue(rawValue);
      const member = componentRef.instance[key];

      if (member && typeof (member as any).set === 'function') {
        (member as { set(v: unknown): void }).set(value);
      } else {
        (componentRef.instance as any)[key] = value;
      }
    });
  }

  private _parseDatasetValue(rawValue?: string): string | undefined {
    let result: string | undefined = rawValue;
    if (result?.startsWith?.('{') || result?.startsWith?.('[')) {
      try {
        result = JSON.parse(result);
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
      } catch (e) { /* empty */
      }
    }
    return result;
  }
}
