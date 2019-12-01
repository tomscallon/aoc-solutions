/* @flow */

import {
  FIRST_YEAR,
  FINAL_YEAR,
  getInputFilePath,
  getSolutionFilePath,
} from '../utils';
import Command from './Command';
import {loadConfig} from '../LanguageConfig';

export default new Command<string>(
  'benchmark',
  [
    Command.Validators.string,
    Command.Validators.integer(FIRST_YEAR, FINAL_YEAR),
    Command.Validators.integer(1, 25),
    Command.Validators.integer(1, 2),
  ],
  async ([lang, year, day, part]) => {
    const config = await loadConfig(lang);
    const result = await config.runSolution(year, day, part, true);

    return {
      success: true,
      result: result.stdout,
    };
  },
);
