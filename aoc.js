#! /usr/local/bin/node

const fs = require('fs');
const fse = require('fs-extra');
const prompt = require('prompt');

const printUsageError = (message) => console.error(
  `Error: ${message}\n\n` +
  'Proper Usage: ./aoc.js <action> <year> <day> [part = 1]\n' +
  '  action: \'make\' or \'run\'\n' +
  '  year:   2015, 2016, or 2017\n' +
  '  day:    an integer between 1 and 25, inclusive\n' +
  '  part:   1 or 2 (only for "run")\n'
);

const getFolderPath = (year, day) => `./${year}/${day}`;
const getFilePath = (year, day) => `${getFolderPath(year, day)}/code.js`;

const createCodeFileBody = (year, day) =>
`// Tom Scallon. Advent of Code ${year}, day ${day}.

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8');

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

const actions = {
  make: (year, day) => {
    const folderPath = getFolderPath(year, day);

    fse.mkdirs(folderPath);

    const filePath = getFilePath(year, day);

    const doWrite = () => fs.writeFile(filePath, createCodeFileBody(year, day));

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
  },
  run: (year, day, part) => {
    const filePath = getFilePath(year, day);
    let module;

    try {
      module = require(filePath);
    } catch (e) {
      console.error(`\nHit an error while loading the code: ${e}.\n`);
      process.exit();
    }

    let result;

    try {
      result = module[part]();
    } catch (e) {
      console.error(`\nHit an error while running the code: ${e}.\n`);
      process.exit();
    }

    console.log(`\nRan: ${year}, day ${day}, part ${part}\nResult: ${result}\n`);
  }
};

// Validate the action
const action = process.argv[2];

if (action !== 'make' && action !== 'run') {
  printUsageError(`'${action}' is not a valid action.`);
  process.exit();
}

// Validate the remaining arguments
let [year, day, part] = process.argv.slice(3);
year = +year;
day = +day;

// Validate 'year'
if (!year || year % 1 !== 0 || year < 2015 || year > 2017) {
  printUsageError(`'year' must be 2015, 2016, or 2017`);
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
} else if(action === 'make') {
  // Part was provided with 'make' action (has no effect).
  console.log(
    `'part' is meaningless for the 'make' action; it will be ignored`
  );
} else if(!part || part % 1 !== 0 || part < 1 || part > 2) {
  printUsageError(`'part' must be 1 or 2`);
  process.exit();
}

// Done validating, now run!
if (action === 'make') {
  actions.make(year, day);
} else if (action === 'run') {
  actions.run(year, day, part);
} else {
  // Should never happen.
  printUsageError(`You really screwed up. Action ${action} isn't allowed.`);
  process.exit();
}
