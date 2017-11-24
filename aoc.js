#! /usr/local/bin/node

const fs = require('fs');

const printUsageError = (message) => console.error(
  `\nError: ${message}\n\n` +
  'Proper Usage: ./aoc.js <action> <year> <day> [part = 1]\n' +
  '  action: \'make\' or \'run\'\n' +
  '  year:   2015, 2016, or 2017\n' +
  '  day:    an integer between 1 and 25, inclusive\n' +
  '  part:   1 or 2 (only for "run")\n'
);

const getFolderPath = (year, day) => `./${year}/${day}`;

const createCodeFileBody = (year, day) =>
`// Tom Scallon. Advent of Code ${year}, day ${day}.

// Read in input.
const input = fs.readFileSync('./input.txt', 'utf8');

// Part 1 code.
const p1 = () => {
  throw 'Not yet implemented';
};

// Part 2 code.
const p2 = () => {
  throw 'Not yet implemented';
};

exports.p1 = p1;
exports.p2 = p2;`;

const actions = {
  make: (year, day) => {
    const folderPath = getFolderPath(year, day);

    fs.mkdirSync(folderPath);

    const filePath = `${folderPath}/code.js`;

    fs.writeFile(filePath, createCodeFileBody(year, day));
  },
  run: (year, day, part) => {

  }
};

// Validate the action
const action = process.argv[2];

if (action !== 'make' && action !== 'run') {
  printUsageError(`'${action}' is not a valid action.`);
}

// Validate the remaining arguments
let [year, day, part] = process.argv.slice(3);
year = +year;
day = +day;

// Validate 'year'
if (!year || year % 1 !== 0 || year < 2015 || year > 2017) {
  printUsageError(`'year' must be 2015, 2016, or 2017`);
}

// Validate 'day'
if (!day || day % 1 !== 0 || day < 1 || day > 25) {
  printUsageError(`'day' must be an integer between 1 and 25, inclusive`)
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
}

// Done validating, now run!
if (action === 'make') {
  actions.make(year, day);
} else if (action === 'run') {
  actions.run(year, day, part);
} else {
  // Should never happen.
  printUsageError(`You really screwed up. Action ${action} isn't allowed.`);
}
