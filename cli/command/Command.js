/* @flow */

export type ArgValidatorResult<+T> = (
  | {+valid: false, +reason: string}
  | {+valid: true, +value: T}
);
export type ArgValidator<+T> = string => ArgValidatorResult<T>;
export type Result<+T> = $ReadOnly<
  | {|success: true, result: T|}
  | {|success: false, error: string|}
>;

type ApplyValidator = <T>(ArgValidator<T>) => T;

class Command<T> {
  static Validators = {};
  static _all: {[string]: Command<any>} = {};

  static _execute = async (
    name: string,
    args: string | Array<string>,
  ): Promise<Result<any>> => {
    if (!(name in Command._all)) {
      throw new Error(`Command '${name}' doesn't exist`);
    }

    return await Command._all[name].execute(args);
  };

  _name: string;
  _validators: Array<ArgValidator<*>>;
  _execute: Array<*> => Promise<Result<T>>;

  constructor<V: Array<any>>(
    name: string,
    validators: V,
    execute: $TupleMap<V, ApplyValidator> => Promise<Result<T>>,
  ) {
    // Store the command globally, or throw if it already exists.
    if (name in Command._all) {
      throw new Error(`Command '${name}' already exists`);
    }
    Command._all[name] = this;

    this._name = name;
    this._validators = validators;
    this._execute = execute;
  }

  _parseArgs(args: Array<string>): Array<*> {
    const validatorResults: Array<ArgValidatorResult<*>> =
      this._validators.map((v, i) => v(args[i]));
    const errors: Array<[number, string, string]> = validatorResults
      .map((r, i) => r.valid ? null : [i, args[i], r.reason])
      .filter(Boolean);

    if (errors.length > 0) {
      const errorText = errors
        .map(([i, a, r]) => `  Index: ${i}, arg: ${a}, reason: ${r}`)
        .join('\n');
      throw new Error('Failed to parse arguments\n' + errorText);
    }

    return validatorResults.map(r => r.valid ? r.value : null);
  }

  async execute(args: string | Array<string>): Promise<Result<T>> {
    const stringArgs = typeof args === 'string' ? args.split(/\s+/) : args;

    try {
      if (stringArgs.length !== this._validators.length) {
        return {
          success: false,
          error: 'Wrong number of arguments; expected '
            + `${this._validators.length} but got ${stringArgs.length}`,
        };
      }

      return await this._execute(this._parseArgs(stringArgs));
    } catch (e) {
      return {
        success: false,
        error: 'Unhandled error while running command ' +
          `'${this._name}': ${e.message}`,
      };
    }
  }
}

Command.Validators.boolean = (arg => {
  if (arg === 'false' || arg === 'f') {
    return {
      valid: true,
      value: false,
    };
  }

  if (arg === 'true' || arg === 't') {
    return {
      valid: true,
      value: true,
    }
  }

  return {
    valid: false,
    reason: 'Arg must be false, f, true, or t',
  }
}: ArgValidator<boolean>);

Command.Validators.string = (arg => ({
  valid: true,
  value: arg,
}): ArgValidator<string>);

Command.Validators.number = (
  min: ?number = undefined,
  max: ?number = undefined,
): ArgValidator<number> => arg => {
  const value = +arg;

  if (isNaN(value)) {
    return {
      valid: false,
      reason: `Not a number`
    };
  }

  if (min != null && value < min) {
    return {
      valid: false,
      reason: 'Too small'
    };
  }

  if (max != null && value > max) {
    return {
      valid: false,
      reason: 'Too large',
    }
  }

  return {valid: true, value};
};

Command.Validators.integer = (
  min: ?number = undefined,
  max: ?number = undefined,
): ArgValidator<number> => {
  const numValidator = Command.Validators.number(min, max);

  return arg => {
    const res = numValidator(arg);

    return !res.valid || res.value % 1 === 0
      ? res
      : {valid: false, reason: 'Number is not an integer'};
  };
}

export default Command;
