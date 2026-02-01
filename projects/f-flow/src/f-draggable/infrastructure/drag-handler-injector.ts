import { inject, Injectable, Injector, ProviderToken, runInInjectionContext } from '@angular/core';
import { DragCanvasHandler } from '../drag-canvas';
import {
  CreateConnectionHandler,
  DragConnectionWaypointHandler,
  ReassignConnectionHandler,
} from '../connection';
import { DropToGroupHandler } from '../drop-to-group';
import {
  DragNodeConnectionBothSidesHandler,
  DragNodeConnectionSourceHandler,
  DragNodeConnectionTargetHandler,
} from '../f-node-move';

type NoArgsCtor<T> = new () => T;

export interface IDestroyable {
  destroy(): void;
}

function isDestroyable(value: unknown): value is IDestroyable {
  return !!value && typeof (value as IDestroyable).destroy === 'function';
}

interface IHasDestroy {
  destroy?(): void;
}

@Injectable()
export class DragHandlerInjector {
  private readonly _injector = inject(Injector);
  private _dragInjector: Injector | null = null;

  private _created: unknown[] = [];

  public create(): void {
    this._dragInjector = Injector.create({
      providers: [
        {
          provide: DragCanvasHandler,
          useClass: DragCanvasHandler,
        },
        {
          provide: DragConnectionWaypointHandler,
          useClass: DragConnectionWaypointHandler,
        },
        {
          provide: CreateConnectionHandler,
          useClass: CreateConnectionHandler,
        },
        {
          provide: ReassignConnectionHandler,
          useClass: ReassignConnectionHandler,
        },
        {
          provide: DropToGroupHandler,
          useClass: DropToGroupHandler,
        },
        {
          provide: DragNodeConnectionSourceHandler,
          useClass: DragNodeConnectionSourceHandler,
        },
        {
          provide: DragNodeConnectionTargetHandler,
          useClass: DragNodeConnectionTargetHandler,
        },
        {
          provide: DragNodeConnectionBothSidesHandler,
          useClass: DragNodeConnectionBothSidesHandler,
        },
      ],
      parent: this._injector,
    });

    this._created = [];
  }

  public get<T>(token: ProviderToken<T>): T {
    if (!this._dragInjector) {
      throw new Error(
        'DragHandlerInjector has not been created. Call create() before using get().',
      );
    }

    return this._dragInjector.get(token);
  }

  public createInstance<T>(ctor: NoArgsCtor<T>): T {
    if (!this._dragInjector) {
      throw new Error('DragHandlerInjector is not created');
    }

    const instance = runInInjectionContext(this._dragInjector, () => new ctor());

    this._created.push(instance);

    return instance;
  }

  public destroy(): void {
    for (const x of this._created) {
      if (isDestroyable(x)) {
        x.destroy();
      }
    }
    this._created = [];

    (this._dragInjector as IHasDestroy)?.destroy?.();
    this._dragInjector = null;
  }
}
