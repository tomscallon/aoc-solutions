/* @flow */

import Command from './Command';

import {
  FIRST_YEAR,
  FINAL_YEAR,
  getInputFilePath,
  getInputURL,
  makeRequest,
  writeFile,
} from '../utils';

export default new Command(
  'get-input',
  [
    Command.Validators.integer(FIRST_YEAR, FINAL_YEAR),
    Command.Validators.integer(1, 25),
  ],
  async ([year, day]) => {
    const input = await makeRequest(getInputURL(year, day));
    await writeFile(getInputFilePath(year, day), input);
  },
);
