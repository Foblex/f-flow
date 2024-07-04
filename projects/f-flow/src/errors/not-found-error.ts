import { createErrorClass } from './create-error-class';

export interface NotFoundError extends Error {
}

export interface NotFoundCtor {

  new(message?: string): NotFoundError;
}

export const NotFoundError: NotFoundCtor = createErrorClass(
    (_super) =>
        function error(this: any, message: string) {
          _super(this);
          this.message = message || 'The requested resource was not found.';
          this.code = 404;
        }
);
