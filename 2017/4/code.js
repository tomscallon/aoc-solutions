// Tom Scallon. Advent of Code 2017, day 4.
const utils = require('../../utils');

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n');

// Part 1 code.
const RE = /(\b[a-z]+\b).*\1/;

const p1 = () => input.reduce((s, p) => s + (RE.test(p) ? 0 : 1), 0);

// Part 2 code.
const areAnagrams = (a, b) => {
  // Strings must be same length.
  if (a.length !== b.length) {
    return false;
  }

  // Naive letter check.
  // Protects from unnecessary calls to permutations(),
  // which are incredibly expensive.
  if (Array.prototype.some.call(a, c => b.indexOf(c) === -1)) {
    return false;
  }

  // For each permutation of the first word...
  const perms = utils.permutations(utils.range(a.length - 1));

  for (let i = 0; i < perms.length; i++) {
    if (perms[i].every((j, k) => a[j] === b[k])) {
      return true;
    }
  }

  return false;
}

const hasAnagrams = p => {
  // console.log(`Checking ${p}`);
  const words = p.split(/\s+/g);

  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (areAnagrams(words[i], words[j])) {
        return true;
      }
    }
  }

  return false;
}

const isValid = p => !RE.test(p) && !hasAnagrams(p);

const p2 = () => input.reduce((s, p) => s + (isValid(p) ? 1 : 0), 0);

// Export the functions.
exports[1] = p1;
exports[2] = p2;
