import { IPoint } from '@foblex/2d';

export type TUmlLayer = 'domain' | 'application' | 'infrastructure';

export type TUmlVisibility = '+' | '-' | '#' | '~';

export interface IUmlAttribute {
  visibility: TUmlVisibility;
  name: string;
  type: string;
}

export interface IUmlMethod {
  visibility: TUmlVisibility;
  name: string;
  params: string;
  returnType: string;
}

export interface IUmlClass {
  id: string;
  name: string;
  layer: TUmlLayer;
  stereotype?: string;
  isAbstract?: boolean;
  attributes: IUmlAttribute[];
  methods: IUmlMethod[];
  notes?: string[];
  position?: IPoint;
  packageId?: string;
}
