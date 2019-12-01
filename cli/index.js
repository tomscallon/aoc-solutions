/* @flow */

import {config} from 'dotenv';

import execute from './command/execute';

// Configure dotenv.
config();

// Run the command.
execute(process.argv[2], process.argv.slice(3)).then(r => {
  if (!r.success) {
    console.error(r.error);
  } else {
    console.log(r.result);
  }
});
