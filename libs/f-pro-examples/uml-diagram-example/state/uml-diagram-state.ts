import { computed, Injectable } from '@angular/core';
import { PointExtensions } from '@foblex/2d';
import {
  IUmlConnectionViewModel,
  IUmlGroupViewModel,
  IUmlNodeViewModel,
  UML_CONNECTIONS,
  UML_GROUPS,
  UML_NODES,
} from '../domain';

@Injectable()
export class UmlDiagramState {
  public readonly visibleNodes = computed<IUmlNodeViewModel[]>(() => {
    const groupsById = new Map(UML_GROUPS.map((group) => [group.id, group]));

    return UML_NODES.map((node) => {
      const parentGroup = node.parentId ? groupsById.get(node.parentId) : undefined;
      const absolutePosition = parentGroup
        ? PointExtensions.sum(parentGroup.position, node.position)
        : node.position;

      return {
        ...node,
        position: absolutePosition,
        parentId: node.parentId,
      };
    });
  });

  public readonly visibleGroups = computed<IUmlGroupViewModel[]>(() => {
    return UML_GROUPS;
  });

  public readonly visibleConnections = computed<IUmlConnectionViewModel[]>(() => {
    const visibleIds = new Set(this.visibleNodes().map((item) => item.id));

    return UML_CONNECTIONS.filter((connection) => {
      return visibleIds.has(connection.from) && visibleIds.has(connection.to);
    });
  });
}
