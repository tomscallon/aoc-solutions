// Tom Scallon. Advent of Code 2019, day 5.
const intcode = require('./intcode');

// Read in input.
const {input} = process.env;
const insts = input.split(',');

// Part 1 code.
const p1 = () => {
  intcode(insts);
  return 1;
};

// Part 2 code.
const p2 = () => {
  intcode(insts);
  return 1;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
