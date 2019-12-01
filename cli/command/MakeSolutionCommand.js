/* @flow */

import {loadConfig} from '../LanguageConfig';
import {FIRST_YEAR, FINAL_YEAR, readFile, getSolutionFilePath} from '../utils';
import Command from './Command';

export default new Command<boolean>(
  'make-solution',
  [
    Command.Validators.string,
    Command.Validators.integer(FIRST_YEAR, FINAL_YEAR),
    Command.Validators.integer(1, 25),
  ],
  async ([lang, year, day]) => {
    const config = await loadConfig(lang);
    const solutionPath = getSolutionFilePath(lang, year, day);
    let solution;

    try {
      solution = await readFile(solutionPath);
    } catch (e) {
      solution = undefined;
    }

    if (solution != null) {
      return {
        success: false,
        error: `Solution file '${solutionPath}' already exists`
      };
    }

    await config.writeSolution(year, day);

    return {
      success: true,
      result: true,
    };
  },
);
