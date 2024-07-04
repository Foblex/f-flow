import { createErrorClass } from './create-error-class';

export interface ConflictError extends Error {
}

export interface ConflictErrorCtor {

  new(message?: string): ConflictError;
}

export const ConflictError: ConflictErrorCtor = createErrorClass(
    (_super) =>
        function error(this: any, message: string) {
          _super(this);
          this.message = message || 'Conflict error occurred.';
          this.code = 409;
        }
);
