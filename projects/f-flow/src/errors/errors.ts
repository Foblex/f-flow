import { NotFoundError } from './not-found-error';
import { ConflictError } from './conflict-error';

export function OutputNotFound(id: string): Error {
  return new NotFoundError(`Output with fOutputId ${ id } not found. Make sure there is no f-connection to a non-existent fOutput.`);
}

export function InputNotFound(id: string): Error {
  return new NotFoundError(`Input with fInputId ${ id } not found. Make sure there is no f-connection to a non-existent fInput.`);
}

export function RequiredOutput(): Error {
  return new ConflictError(`The fNode must contain at least one fOutput if there is an fOutlet`);
}
