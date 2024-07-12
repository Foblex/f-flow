import { castToEnum } from './cast-to-enum';

enum TestEnum {
  OPTION_ONE = 'option_one',
  OPTION_TWO = 'option_two',

  //Need in Error message
  OPTION_THREE = 'option_three',
}

describe('castToEnum', () => {
  it('should cast string to enum value using different cases key', () => {
    const result = castToEnum<TestEnum>('OPTION_oNe', 'testEnum', TestEnum);
    expect(result).toBe(TestEnum.OPTION_ONE);
  });

  it('should cast string to enum value using lowercase value', () => {
    const result = castToEnum<TestEnum>('option_two', 'testEnum', TestEnum);
    expect(result).toBe(TestEnum.OPTION_TWO);
  });

  it('should throw an error for unknown value', () => {
    expect(() => castToEnum<TestEnum>('UNKNOWN_OPTION', 'testEnum', TestEnum))
      .toThrowError('Unknown testEnum: UNKNOWN_OPTION. Accepted values: OPTION_ONE, OPTION_TWO, OPTION_THREE');
  });

  it('should throw an error for unknown lowercase value', () => {
    expect(() => castToEnum<TestEnum>('unknown_option', 'testEnum', TestEnum))
      .toThrowError('Unknown testEnum: unknown_option. Accepted values: OPTION_ONE, OPTION_TWO, OPTION_THREE');
  });
});
