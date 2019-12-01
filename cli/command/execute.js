/* @flow */

import type {Result} from './Command';

import Command from './Command';

// Commands are only registered if we include the file that defines them.
// Therefore, to dynamically call a command we need to make sure they're
// all included in the bundle.
import GetInputCommand from './GetInputCommand';
import Run from './RunCommand';

export default async (
  name: string,
  args: string | Array<string>,
): Promise<Result<any>> => await Command._execute(name, args);
