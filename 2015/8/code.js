// Tom Scallon. Advent of Code 2015, day 8.

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n');

// Part 1 code.
const sum = (a, b) => a + b;

const p1 = () => input.map(s => s.length - eval(s).length).reduce(sum, 0);

// Part 2 code.
const encode = s => '"' + s.replace(/([\\"])/g, '\\$1') + '"';

const p2 = () => input.map(s => encode(s).length - s.length).reduce(sum, 0);

// Export the functions.
exports[1] = p1;
exports[2] = p2;
