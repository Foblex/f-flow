import {
  inject,
  Injectable,
  InjectionToken,
  Injector,
  Provider,
  ProviderToken,
  StaticProvider,
} from '@angular/core';
import { DragCanvasHandler } from '../drag-canvas';
import {
  CreateConnectionHandler,
  DragConnectionWaypointHandler,
  ReassignConnectionHandler,
} from '../connection';
import { DropToGroupHandler } from '../drop-to-group';

export const F_DRAG_HANDLERS = new InjectionToken<(Provider | StaticProvider)[]>('F_PLUGINS');

export function provideHandlers(providers: (Provider | StaticProvider)[]): Provider {
  return {
    provide: F_DRAG_HANDLERS,
    useValue: providers,
  };
}

interface IHasDestroy {
  destroy?(): void;
}

@Injectable()
export class DragHandlerInjector {
  private readonly _injector = inject(Injector);
  private _dragInjector: Injector | null = null;

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
      ],
      parent: this._injector,
    });
  }

  public get<T>(token: ProviderToken<T>): T {
    if (!this._dragInjector) {
      throw new Error(
        'DragHandlerInjector has not been created. Call create() before using get().',
      );
    }

    return this._dragInjector.get(token);
  }

  public destroy(): void {
    (this._dragInjector as IHasDestroy)?.destroy?.();
    this._dragInjector = null;
  }
}
