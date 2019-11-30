// Tom Scallon. Advent of Code 2015, day 2.

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(present => {
    let [, l, w, h] = /(\d+)x(\d+)x(\d+)/.exec(present);

    return { l: +l, w: +w, h: +h };
  });

// Part 1 code.
const sum = (a, b) => a + b;

const p1 = () => input
  .map(({ l, w, h }) =>  2 * (l * w + l * h + w * h) + Math.min(l*w, l*h, w*h))
  .reduce(sum, 0);

// Part 2 code.
const numericAscending = (x, y) => x - y;
const minN = (arr, n, compare = numericAscending) => arr.sort(compare).slice(0, n);

const p2 = () => input
  .map(({ l, w, h }) => 2 * minN([l, w, h], 2).reduce(sum) + l * w * h)
  .reduce(sum, 0);

// Export functions.
exports[1] = p1;
exports[2] = p2;
