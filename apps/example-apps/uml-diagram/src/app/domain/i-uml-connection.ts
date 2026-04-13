export type TUmlRelationKind =
  | 'association'
  | 'dependency'
  | 'inheritance'
  | 'aggregation'
  | 'composition'
  | 'realization';

export interface IUmlConnection {
  id: string;
  from: string;
  to: string;
  kind: TUmlRelationKind;
  label?: string;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
}
