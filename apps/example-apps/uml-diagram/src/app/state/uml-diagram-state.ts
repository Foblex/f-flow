import { computed, Injectable, signal } from '@angular/core';
import {
  IUmlClass,
  IUmlConnection,
  IUmlPackage,
  TUmlLayer,
  TUmlRelationKind,
  UML_SEED_CLASSES,
  UML_SEED_CONNECTIONS,
  UML_SEED_PACKAGES,
} from '../domain';

@Injectable()
export class UmlDiagramState {
  private readonly _classes = signal<IUmlClass[]>(UML_SEED_CLASSES);
  private readonly _connections = signal<IUmlConnection[]>(UML_SEED_CONNECTIONS);
  private readonly _packages = signal<IUmlPackage[]>(UML_SEED_PACKAGES);

  private readonly _selectedClassId = signal<string | null>(null);
  private readonly _selectedConnectionId = signal<string | null>(null);

  private readonly _visibleLayers = signal<Set<TUmlLayer>>(
    new Set(['domain', 'application', 'infrastructure']),
  );

  private readonly _visibleRelations = signal<Set<TUmlRelationKind>>(
    new Set([
      'association',
      'dependency',
      'inheritance',
      'aggregation',
      'composition',
      'realization',
    ]),
  );

  private readonly _searchQuery = signal<string>('');

  // --- Public readonly signals ---

  public readonly classes = this._classes.asReadonly();
  public readonly connections = this._connections.asReadonly();
  public readonly packages = this._packages.asReadonly();
  public readonly selectedClassId = this._selectedClassId.asReadonly();
  public readonly selectedConnectionId = this._selectedConnectionId.asReadonly();
  public readonly visibleLayers = this._visibleLayers.asReadonly();
  public readonly visibleRelations = this._visibleRelations.asReadonly();
  public readonly searchQuery = this._searchQuery.asReadonly();

  // --- Computed ---

  public readonly visibleClasses = computed<IUmlClass[]>(() => {
    const layers = this._visibleLayers();
    const query = this._searchQuery().toLowerCase().trim();
    let result = this._classes().filter((c) => layers.has(c.layer));

    if (query) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.stereotype?.toLowerCase().includes(query) ||
          c.attributes.some(
            (a) => a.name.toLowerCase().includes(query) || a.type.toLowerCase().includes(query),
          ) ||
          c.methods.some((m) => m.name.toLowerCase().includes(query)),
      );
    }

    return result;
  });

  public readonly visiblePackages = computed<IUmlPackage[]>(() => {
    const layers = this._visibleLayers();

    return this._packages().filter((p) => layers.has(p.layer));
  });

  public readonly visibleConnections = computed<IUmlConnection[]>(() => {
    const visibleIds = new Set(this.visibleClasses().map((c) => c.id));
    const relations = this._visibleRelations();

    return this._connections().filter(
      (conn) => visibleIds.has(conn.from) && visibleIds.has(conn.to) && relations.has(conn.kind),
    );
  });

  public readonly highlightedClassIds = computed<Set<string>>(() => {
    const classId = this._selectedClassId();
    if (!classId) {
      return new Set();
    }

    return this._getRelatedClassIds(classId);
  });

  public readonly highlightedConnectionIds = computed<Set<string>>(() => {
    const classId = this._selectedClassId();
    const connId = this._selectedConnectionId();

    if (connId) {
      return new Set([connId]);
    }

    if (!classId) {
      return new Set();
    }

    const ids = new Set<string>();
    this.visibleConnections().forEach((conn) => {
      if (conn.from === classId || conn.to === classId) {
        ids.add(conn.id);
      }
    });

    return ids;
  });

  public readonly hasHighlight = computed(
    () => this._selectedClassId() !== null || this._selectedConnectionId() !== null,
  );

  public readonly selectedClass = computed<IUmlClass | null>(() => {
    const id = this._selectedClassId();
    if (!id) {
      return null;
    }

    return this._classes().find((c) => c.id === id) ?? null;
  });

  public readonly selectedConnection = computed<IUmlConnection | null>(() => {
    const id = this._selectedConnectionId();
    if (!id) {
      return null;
    }

    return this._connections().find((c) => c.id === id) ?? null;
  });

  public readonly diagramStats = computed(() => {
    const classes = this._classes();
    const connections = this._connections();

    return {
      totalClasses: classes.length,
      domain: classes.filter((c) => c.layer === 'domain').length,
      application: classes.filter((c) => c.layer === 'application').length,
      infrastructure: classes.filter((c) => c.layer === 'infrastructure').length,
      totalConnections: connections.length,
      composition: connections.filter((c) => c.kind === 'composition').length,
      aggregation: connections.filter((c) => c.kind === 'aggregation').length,
      association: connections.filter((c) => c.kind === 'association').length,
      inheritance: connections.filter((c) => c.kind === 'inheritance').length,
      dependency: connections.filter((c) => c.kind === 'dependency').length,
      realization: connections.filter((c) => c.kind === 'realization').length,
    };
  });

  public readonly classConnectionCounts = computed(() => {
    const map = new Map<string, number>();
    this._connections().forEach((conn) => {
      map.set(conn.from, (map.get(conn.from) ?? 0) + 1);
      map.set(conn.to, (map.get(conn.to) ?? 0) + 1);
    });

    return map;
  });

  // --- Actions ---

  public selectClass(classId: string | null): void {
    this._selectedConnectionId.set(null);
    this._selectedClassId.set(classId === this._selectedClassId() ? null : classId);
  }

  public selectConnection(connectionId: string | null): void {
    this._selectedClassId.set(null);
    this._selectedConnectionId.set(
      connectionId === this._selectedConnectionId() ? null : connectionId,
    );
  }

  public clearSelection(): void {
    this._selectedClassId.set(null);
    this._selectedConnectionId.set(null);
  }

  public toggleLayer(layer: TUmlLayer): void {
    const current = new Set(this._visibleLayers());
    if (current.has(layer) && current.size > 1) {
      current.delete(layer);
    } else {
      current.add(layer);
    }
    this._visibleLayers.set(current);
  }

  public showAllLayers(): void {
    this._visibleLayers.set(new Set(['domain', 'application', 'infrastructure']));
  }

  public toggleRelation(kind: TUmlRelationKind): void {
    const current = new Set(this._visibleRelations());
    if (current.has(kind)) {
      current.delete(kind);
    } else {
      current.add(kind);
    }
    this._visibleRelations.set(current);
  }

  public showAllRelations(): void {
    this._visibleRelations.set(
      new Set([
        'association',
        'dependency',
        'inheritance',
        'aggregation',
        'composition',
        'realization',
      ]),
    );
  }

  public setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  // --- Private ---

  private _getRelatedClassIds(classId: string): Set<string> {
    const ids = new Set<string>([classId]);
    this._connections().forEach((conn) => {
      if (conn.from === classId) {
        ids.add(conn.to);
      }
      if (conn.to === classId) {
        ids.add(conn.from);
      }
    });

    return ids;
  }
}
