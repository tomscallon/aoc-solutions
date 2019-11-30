/* @flow */

import Command from './Command';

// Commands are only registered if we include the file that defines them.
// Therefore, to dynamically call a command we need to make sure they're
// all included in the bundle.
import GetInputCommand from './GetInputCommand';

export default (name: string, args: string | Array<string>) =>
  Command._execute(name, args);
