import { ComponentRef, Injectable } from '@angular/core';
import { IDynamicComponentInstance } from './models';

@Injectable()
export class DynamicComponentsStore {
  private _components: ComponentRef<IDynamicComponentInstance>[] = [];
  private _renderGeneration = 0;

  public get renderGeneration(): number {
    return this._renderGeneration;
  }

  public isCurrentRender(generation: number): boolean {
    return this._renderGeneration === generation;
  }

  public dispose(): void {
    this._renderGeneration++;
    this._components.forEach((ref) => ref.destroy());
    this._components = [];
  }

  public addComponent(
    reference: ComponentRef<IDynamicComponentInstance>,
    element?: HTMLElement,
  ): void {
    this._components.push(reference);

    this._assignInputs(reference, element);
    reference.instance?.initialize?.();
  }

  private _assignInputs(
    componentRef: ComponentRef<IDynamicComponentInstance>,
    element?: HTMLElement,
  ): void {
    const dataset = element?.dataset;
    if (!dataset) return;

    Object.entries(dataset).forEach(([key, rawValue]) => {
      const value = this._parseDatasetValue(rawValue);
      const member = componentRef.instance[key];

      if (this._hasSetter(member)) {
        member.set(value);
      } else {
        componentRef.instance[key] = value;
      }
    });
  }

  private _hasSetter(value: unknown): value is { set(value: unknown): void } {
    const canHaveProperties =
      (typeof value === 'object' && value !== null) || typeof value === 'function';

    return canHaveProperties && 'set' in value && typeof value.set === 'function';
  }

  private _parseDatasetValue(rawValue?: string): unknown {
    if (!rawValue?.startsWith('{') && !rawValue?.startsWith('[')) {
      return rawValue;
    }

    try {
      return JSON.parse(rawValue) as unknown;
    } catch {
      return rawValue;
    }
  }
}
