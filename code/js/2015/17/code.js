// Tom Scallon. Advent of Code 2015, day 17.
const utils = require('../../utils');

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(x => +x);

const capacity = 150;

// Part 1 code.
const p1 = () => {
  const sums = utils.summationsUsing(
    input,
    capacity,
    {
      repeat: false,
      unique: true
    }
  );

  let count = 0;

  for (let sum of sums) {
    count++;
  }

  return count;
};

// Part 2 code.
const p2 = () => {
  const sums = utils.summationsUsing(
    input,
    capacity,
    {
      repeat: false,
      unique: true
    }
  );

  let min = input.length + 1;
  let count = 0;

  for (let sum of sums) {
    if (sum.length < min) {
      min = sum.length;
      count = 1;
    } else if (sum.length === min) {
      count++;
    }
  }

  return count;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
