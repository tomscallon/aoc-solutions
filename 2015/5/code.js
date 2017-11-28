// Tom Scallon. Advent of Code 2015, day 5.

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n');

// Part 1 code.
const hasBadPair = s => /(ab|cd|pq|xy)/.test(s);
const vowelCount = s => Array.prototype.filter.call(s, c => /[aeiou]/.test(c)).length;
const hasDoubleLetter = s => /([a-z])\1/.test(s);

const p1 = () => {
  return input.filter(
    s => !hasBadPair(s) && vowelCount(s) >= 3 && hasDoubleLetter(s)
  ).length;
};

// Part 2 code.
const hasRepeatedPair = s => /([a-z]{2})[a-z]*\1/.test(s)
const hasSandwichedLetter = s => /([a-z])[a-z]\1/.test(s)

const p2 = () => {
  return input.filter(s => hasRepeatedPair(s) && hasSandwichedLetter(s)).length;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
