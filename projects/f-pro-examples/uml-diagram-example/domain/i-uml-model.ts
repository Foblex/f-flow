import { IPoint, ISize } from '@foblex/2d';
import { EFConnectionBehavior, EFConnectionConnectableSide, EFConnectionType } from '@foblex/flow';

export type TUmlLayer = 'domain' | 'application' | 'infrastructure';

export type TUmlRelationKind =
  | 'association'
  | 'dependency'
  | 'inheritance'
  | 'aggregation'
  | 'composition'
  | 'realization';

export interface IUmlClassData {
  name: string;
  layer: TUmlLayer;
  stereotype?: string;
  attributes: string[];
  methods: string[];
  notes?: string[];
}

export interface IUmlNodeViewModel {
  id: string;
  position: IPoint;
  parentId?: string;
  data: IUmlClassData;
}

export interface IUmlPackageData {
  name: string;
  description: string;
  layer: TUmlLayer;
}

export interface IUmlGroupViewModel {
  id: string;
  position: IPoint;
  size: ISize;
  data: IUmlPackageData;
}

export interface IUmlConnectionViewModel {
  id: string;
  from: string;
  to: string;
  kind: TUmlRelationKind;
  behavior: EFConnectionBehavior;
  type: EFConnectionType;
  outputSide?: EFConnectionConnectableSide;
  inputSide?: EFConnectionConnectableSide;
  label?: string;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
}
