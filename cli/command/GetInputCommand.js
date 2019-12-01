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

export default new Command<boolean>(
  'get-input',
  [
    Command.Validators.integer(FIRST_YEAR, FINAL_YEAR),
    Command.Validators.integer(1, 25),
  ],
  async ([year, day]) => {
    const res = await makeRequest(getInputURL(year, day));

    if (res.status !== 200) {
      return {
        success: false,
        error: `Failed to fetch input (${res.status}): ${res.data}`,
      };
    }

    await writeFile(getInputFilePath(year, day), res.data);
    return {
      success: true,
      result: true,
    };
  },
);
