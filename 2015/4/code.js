// Tom Scallon. Advent of Code 2015, day 4.
const md5 = require('./md5');

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8').trim();

// Part 1 code.
const p1 = () => {
  let i = 1;

  while (true) {
    if (md5(input + i).startsWith('00000')) {
      return i;
    }

    i++;
  }
};

// Part 2 code.
const p2 = () => {
  let i = 1;

  while (true) {
    if (md5(input + i).startsWith('000000')) {
      return i;
    }

    i++;
  }
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
