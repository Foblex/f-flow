import { configureDiTest, FMediator, injectFromDi } from '@foblex/flow';

class UnregisteredRequest {
  static readonly fToken = Symbol('UnregisteredRequest');
}

class TokenlessRequest {}

describe('FMediator.execute dev diagnostics', () => {
  let mediator: FMediator;

  beforeEach(() => {
    configureDiTest({ providers: [FMediator] });
    mediator = injectFromDi(FMediator);
  });

  it('throws a named error for a request without a registered execution', () => {
    expect(() => mediator.execute(new UnregisteredRequest())).toThrowError(
      /No execution is registered for "UnregisteredRequest"/,
    );
  });

  it('throws the same named error for a request class without fToken', () => {
    expect(() => mediator.execute(new TokenlessRequest())).toThrowError(
      /No execution is registered for "TokenlessRequest"/,
    );
  });
});
