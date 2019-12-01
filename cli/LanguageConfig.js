/* @flow */

const {execFile} = require('child_process');

import {readFile, writeFile, getInputFilePath, getSolutionFilePath} from './utils';

export type ExecResult = {|
  stdout: string,
  stderr: string,
|};

type ConfigJSON = {|extension: string|};

const getLanguageDir = (name: string) => `language_configuration/${name}`;
const getConfigPath = (name: string) => `${getLanguageDir(name)}/config.json`;
const getTemplatePath = (name: string) => `${getLanguageDir(name)}/template`;
const getRunPath = (name: string) => `${getLanguageDir(name)}/run`;

const loadJSON = async (name: string): Promise<ConfigJSON> => {
  const contents = await readFile(getConfigPath(name));
  return JSON.parse(contents);
};

const loadTemplate = async (name: string): Promise<string> => {
  return await readFile(getTemplatePath(name));
};

const replace = (str: string, reps: {[string]: mixed}) => str
  .replace(
    new RegExp(`\\$(${Object.keys(reps).join('|')})`, 'g'),
    (_, key) => String(reps[key]),
  );

class LanguageConfig {
  _name: string;
  _json: ConfigJSON;
  _template: string;

  constructor(name: string) {
    this._name = name;
  }

  async _init(): Promise<LanguageConfig> {
    this._json = await loadJSON(this._name);
    this._template = await loadTemplate(this._name);
    return this;
  }

  getName(): string {
    return this._name;
  }

  getExtension(): string {
    return this._json.extension;
  }

  buildSolutionFile(year: number, day: number): string {
    return replace(this._template, {year, day});
  }

  async writeSolution(year: number, day: number): Promise<void> {
    return await writeFile(
      getSolutionFilePath(this._name, year, day),
      this.buildSolutionFile(year, day),
    );
  }

  async runSolution(
    year: number,
    day: number,
    part: number,
  ): Promise<ExecResult> {
    return new Promise(
      (resolve, reject) => execFile(
        getRunPath(this._name),
        [
          getInputFilePath(year, day),
          getSolutionFilePath(this._name, year, day),
          '' + part,
        ],
        (err, stdout, stderr) => err
          ? reject(err)
          : resolve({
            stdout: stdout.toString(),
            stderr: stderr.toString(),
          }),
      ),
    );
  }
}

export type {LanguageConfig};
export const loadConfig = async (name: string): Promise<LanguageConfig> =>
  await (new LanguageConfig(name))._init();
