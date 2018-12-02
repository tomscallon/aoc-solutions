#! /usr/local/bin/node
require('dotenv').config();

const fs = require('fs');
const fse = require('fs-extra');
const https = require('https');
const prompt = require('prompt');

const FINAL_YEAR = 2018;

const printUsageError = (message) => console.error(
  `Error: ${message}\n\n` +
  'Proper Usage: ./aoc.js <action> <year> <day> [part = 1]\n' +
  `  action: ${Object.keys(actions)}\n` +
  `  year:   2015 to ${FINAL_YEAR}\n` +
  '  day:    an integer between 1 and 25, inclusive\n' +
  '  part:   1 or 2 (only for "run")\n'
);

const getFolderPath = (year, day) => `./${year}/${day}`;
const getCodeFilePath = (year, day) => `${getFolderPath(year, day)}/code.js`;
const getInputFilePath = (year, day) => `${getFolderPath(year, day)}/input.txt`;
const getAnswerFilePath = (year, day) => `${getFolderPath(year, day)}/last_answer.txt`;

const createCodeFileBody = (year, day) =>
`// Tom Scallon. Advent of Code ${year}, day ${day}.

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8').trim();
const lines = input.split('\\n');

// Part 1 code.
const p1 = () => {
  throw 'Not yet implemented';
};

// Part 2 code.
const p2 = () => {
  throw 'Not yet implemented';
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;`;

const AOC_DOMAIN = 'https://adventofcode.com';
const getDayURL = (year, day) => `${AOC_DOMAIN}/${year}/day/${day}`;
const getInputURL = (year, day) => `${getDayURL(year, day)}/input`;
const getSubmitURL = (year, day) => `${getDayURL(year, day)}/answer`;

const writeFile = (path, content, successCallback = undefined) => fs.writeFile(
  path,
  content,
  (err) => {
    if (err) {
      console.error(`Failed to write to ${path}: ${err.message}`);
      process.exit();
    } else if (typeof successCallback === 'function') {
      successCallback();
    }
  }
)

const makeRequest = (url, options, onSuccess, onFail) => {
  https.request(url, options, response => {
    let data = '';

    // Combine chunks into the whole response.
    response.on('data', chunk => data += chunk);

    // The whole response has been received. Call the success callback.
    response.on('end', () => onSuccess(data));

  }).on('error', err => onFail(err))
    .end();
}

const actions = {
  make: (year, day) => {
    const folderPath = getFolderPath(year, day);

    fse.mkdirs(folderPath);

    const filePath = getCodeFilePath(year, day);

    const doWrite = () => writeFile(
      filePath,
      createCodeFileBody(year, day),
      () => console.log(`Created solution file ${filePath}.`),
    );

    console.log(`Creating ${filePath}`);
    fs.stat(filePath, (err, stat) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          console.error(`\nCan't write to the code file '${filePath}': ${err}`);
          process.exit();
        } else {
          // File doesn't exist, so go ahead and create it.
          doWrite();
        }
      } else {
        console.log(`\nThe file '${filePath}' already exists. Overwrite it?`);
        prompt.get(['overwrite'], (err, res) => {
          if (err) {
            console.error(`\nHit an error while collecting input: ${err}.`);
            process.exit();
          }

          if (
            res.overwrite.toLowerCase() === 'y' ||
            res.overwrite.toLowerCase() === 'yes'
          ) {
            doWrite();
            console.log('File was overwritten.\n');
          } else {
            console.log('Didn\'t overwrite the existing file.');
          }
        });
      }
    });

    actions.get_input(year, day);
  },
  get_input: (year, day) => {
    const url = getInputURL(year, day);
    const path = getInputFilePath(year, day);
    console.log(`Requesting input for ${year} day ${day} from ${url}`);
    makeRequest(
      url,
      {
        headers: {
          'cookie': `session=${process.env.SESSION_TOKEN};`,
        },
      },
      input => writeFile(
        path,
        input,
        () => console.log(`Successfully wrote input to ${path}`),
      ),
      err => console.log('Failed to get puzzle input: ' + err.message),
    );
  },
  run: (year, day, part) => {
    const filePath = getCodeFilePath(year, day);
    let module;

    try {
      module = require(filePath);
    } catch (e) {
      console.error(`\nHit an error while loading the code: ${e}.\n`);
      process.exit();
    }

    let result;
    let time;

    try {
      time = Date.now();
      result = module[part]();
      time = Date.now() - time;
    } catch (e) {
      console.error(`\nHit an error while running the code: ${e}.\n`);
      process.exit();
    }

    console.log(`\nRan: ${year}, day ${day}, part ${part}\nTook: ${time}ms\nResult: ${result}\n`);
  }
};

// Validate the action
const action = process.argv[2];

if (!(action in actions)) {
  printUsageError(`'${action}' is not a valid action.`);
  process.exit();
}

// Validate the remaining arguments
let [year, day, part] = process.argv.slice(3);
year = +year;
day = +day;

// Validate 'year'
if (!year || year % 1 !== 0 || year < 2015 || year > FINAL_YEAR) {
  printUsageError(`'year' must be 2015 - ${FINAL_YEAR}`);
  process.exit();
}

// Validate 'day'
if (!day || day % 1 !== 0 || day < 1 || day > 25) {
  printUsageError(`'day' must be an integer between 1 and 25, inclusive`);
  process.exit();
}

// Validate 'part'
if (part === undefined) {
  // Default to part 1.
  part = 1;
} else if(['make', 'get_input'].includes(action)) {
  // Part was provided with 'make' action (has no effect).
  console.log(
    `'part' is meaningless for action ${action}; it will be ignored`
  );
} else if(!part || part % 1 !== 0 || part < 1 || part > 2) {
  printUsageError(`'part' must be 1 or 2`);
  process.exit();
}

// Done validating, now run!
actions[action](year, day, part);
