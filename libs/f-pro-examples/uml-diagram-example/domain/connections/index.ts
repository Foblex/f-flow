import { IUmlConnectionViewModel } from '../i-uml-model';
import { UML_APPLICATION_CONNECTIONS } from './application-connections';
import { UML_CROSS_LAYER_CONNECTIONS } from './cross-layer-connections';
import { UML_DOMAIN_CONNECTIONS } from './domain-connections';

export const UML_CONNECTIONS: IUmlConnectionViewModel[] = [
  ...UML_DOMAIN_CONNECTIONS,
  ...UML_APPLICATION_CONNECTIONS,
  ...UML_CROSS_LAYER_CONNECTIONS,
];

export * from './application-connections';
export * from './cross-layer-connections';
export * from './domain-connections';
