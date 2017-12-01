// Tom Scallon. Advent of Code 2017, day 1.

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8').trim();

// Part 1 code.
const p1 = () => {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    let j = (i + 1) % input.length;

    if (input[i] === input[j]) sum += (+input[i]);
  }

  return sum;
};

// Part 2 code.
const p2 = () => {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    let j = (i + input.length / 2) % input.length;

    if (input[i] === input[j]) sum += (+input[i]);
  }

  return sum;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
