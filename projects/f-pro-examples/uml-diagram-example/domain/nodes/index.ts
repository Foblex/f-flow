import { IUmlNodeViewModel } from '../i-uml-model';
import { UML_APPLICATION_NODES } from './application-nodes';
import { UML_DOMAIN_NODES } from './domain-nodes';
import { UML_INFRASTRUCTURE_NODES } from './infrastructure-nodes';

export const UML_NODES: IUmlNodeViewModel[] = [
  ...UML_DOMAIN_NODES,
  ...UML_APPLICATION_NODES,
  ...UML_INFRASTRUCTURE_NODES,
];

export * from './application-nodes';
export * from './domain-nodes';
export * from './infrastructure-nodes';
