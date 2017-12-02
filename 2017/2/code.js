// Tom Scallon. Advent of Code 2017, day 2.

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(line => line.split(/\s+/).map(x => +x));

// Part 1 code.
const max = a => Math.max(...a);
const min = a => Math.min(...a);
const lineCheck = a => max(a) - min(a);
const sum = (a, b) => a + b;

const p1 = () => input.map(lineCheck).reduce(sum, 0);

// Part 2 code.
const findDivisors = a => {
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (a[i] % a[j] === 0) {
        return a[i] / a[j];
      } else if (a[j] % a[i] === 0) {
        return a[j] / a[i];
      }
    }
  }
};

const p2 = () => input.map(findDivisors).reduce(sum, 0);

// Export the functions.
exports[1] = p1;
exports[2] = p2;
