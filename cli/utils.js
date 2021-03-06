/* @flow */

import fse from 'fs-extra';
import https from 'https';

export const FIRST_YEAR = 2015;
export const FINAL_YEAR = 2019;

const AOC_DOMAIN = 'https://adventofcode.com';
const getDayURL = (
  year: number,
  day: number,
): string => `${AOC_DOMAIN}/${year}/day/${day}`;

export const getInputURL = (
  year: number,
  day: number,
): string => `${getDayURL(year, day)}/input`;

export const getSubmitURL = (
  year: number,
  day: number,
): string => `${getDayURL(year, day)}/answer`;

export const getInputFilePath = (
  year: number,
  day: number,
): string => `input/${year}/${day}.txt`;

export const getAnswerFilePath = (
  year: number,
  day: number,
): string => `answer/${year}/${day}.json`;

// TODO Look up the extension rather than hardcoding js.
export const getSolutionFilePath = (
  lang: string,
  year: number,
  day: number,
): string => `solution/${lang}/${year}/${day}.js`;

export type Response = {|
  status: number,
  data: string,
|};
export const makeRequest = async (
  url: string,
  method: 'GET' | 'POST' = 'GET',
) => new Promise<Response>((resolve, reject) =>
  https
    .request(
      url,
      {
        method,
        headers: {
          'cookie': `session=${process.env.SESSION_TOKEN || ''};`,
        },
      },
      response => {
        let data = '';

        // Combine chunks into the whole response.
        response.on('data', chunk => data += chunk);

        // The whole response has been received. Call the success callback.
        response.on('end', () => resolve({
          status: response.statusCode,
          data,
        }));
      },
    )
    .on('error', err => reject(err))
    .end()
);

export const readFile = async (path: string) => new Promise<string>(
  (resolve, reject) => fse.readFile(
    path,
    (err, content) => err ? reject(err) : resolve(content.toString()),
  )
);

export const writeFile = async (
  path: string,
  content: string,
) => new Promise<void>(
  (resolve, reject) => fse.outputFile(
    path,
    content,
    err => err ? reject(err) : resolve(),
  ),
);
