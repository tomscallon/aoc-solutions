// Tom Scallon. Advent of Code 2017, day 5.

// Read in input.
const toNumber = x => +x;
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(toNumber);

// Part 1 code.
const next = c => c + input[c]++;

const p1 = () => {
  let step = 0;
  let current = 0;

  while (current >= 0 && current < input.length) {
    current = next(current);
    step++;
  }

  return step;
};

// Part 2 code.
const next2 = c => {
  const jump = input[c];

  jump >= 3 ?
    input[c]-- :
    input[c]++;

  return c + jump;
};

const p2 = () => {
  let step = 0;
  let current = 0;

  while (current >= 0 && current < input.length) {
    current = next2(current);
    step++;
  }

  return step;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
