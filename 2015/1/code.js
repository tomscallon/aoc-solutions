// Tom Scallon. Advent of Code 2015, day 1.

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8');

// Part 1 code.
const p1 = () => Array.prototype.reduce.call(
  input,
  (sum, c) => c === '(' ? sum + 1 : sum - 1,
  0
);

// Part 2 code.
const p2 = () => {
  for (let i = 0, s = 0; i < input.length; i++) {
    s += input[i] === '(' ? 1 : -1;

    if (s < 0) {
      return i + 1;
    }
  }

  return -1;
};

exports[1] = p1;
exports[2] = p2;
