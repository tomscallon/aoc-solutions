// Tom Scallon. Advent of Code 2019, day 4.

// Read in input.
const {input} = process.env;
const [start, end] = input.split('-').map(Number);

const F = require('./fn');

// Part 1 code.
const twoAdjacentSame = n => /(\d)\1/.test(n);

const increasing = n => {
  let s = n + '';

  for (let i = 0; i < s.length - 1; i++) {
    if (+s[i] > +s[i + 1]) {
      return false;
    }
  }

  return true;
};

const p1 = () => F.collect(
  F.genFilter(
    F.all(twoAdjacentSame, increasing)
  )(F.range(end + 1, start)),
).length;

// Part 2 code.
const strictTwoAdjacentSame = n =>
  F.allMatches(n + '', /(\d)\1*/g)
    .filter(x => x[0].length === 2)
    .length > 0;

const p2 = () => F.collect(
  F.genFilter(
    F.all(strictTwoAdjacentSame, increasing)
  )(F.range(end + 1, start)),
).length;

// Export the functions.
exports[1] = p1;
exports[2] = p2;
