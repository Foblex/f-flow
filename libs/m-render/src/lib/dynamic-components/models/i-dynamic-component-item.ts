import { Type } from "@angular/core";
import { IDynamicComponentInstance } from './i-dynamic-component-instance';

export interface IDynamicComponentItem {
  selector: string;
  component: Promise<Type<IDynamicComponentInstance>>;
}
