// Tom Scallon. Advent of Code 2019, day 9.

// Read in input.
const intcode = require('./intcode');

const {input} = process.env;
const insts = input.split(',');

// Part 1 code.
const p1 = () => {
  const res = intcode(
    [...insts],
    [1],
  );

  const [mem, out] = res.next().value;

  return out;
};

// Part 2 code.
const p2 = () => {
  const res = intcode(
    [...insts],
    [2],
  );

  const [mem, out] = res.next().value;

  return out;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
