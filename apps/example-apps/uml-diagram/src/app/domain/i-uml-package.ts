import { IPoint, ISize } from '@foblex/2d';
import { TUmlLayer } from './i-uml-class';

export interface IUmlPackage {
  id: string;
  name: string;
  description: string;
  layer: TUmlLayer;
  position?: IPoint;
  size?: ISize;
}
