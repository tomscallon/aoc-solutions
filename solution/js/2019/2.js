// Tom Scallon. Advent of Code 2019, day 2.
const intcode = require('./intcode');

// Read in input.
const {input} = process.env;
const nums = input.split(',').map(Number);

const intcodeWithParams = (noun, verb) => {
  const inst = [...nums];
  inst[1] = noun;
  inst[2] = verb;
  return intcode(inst)[0];
};

// Part 1 code.
const p1 = () => {
  return intcodeWithParams(12, 2);
};

// Part 2 code.
const p2 = () => {
  for (let n = 0; n < 100; n++) {
    for (let v = 0; v < 100; v++) {
      const res = intcodeWithParams(n, v);
      if (res === 19690720) {
        return 100 * n + v;
      }
    }
  }
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
