// Tom Scallon. Advent of Code 2018, day 2.
const utils = require('../../utils.js');

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8').trim();
const lines = input.split('\n');

// Part 1 code.
const countLetters = str => Array.prototype.reduce.call(
  str,
  (map, char) => {
    map[char] = (map[char] || 0) + 1;
    return map;
  },
  {},
);

const p1 = () => {
  let counts = lines.map(countLetters).map(x => Object.values(x));
  let twos = counts.filter(x => x.includes(2)).length;
  let threes = counts.filter(x => x.includes(3)).length;
  return twos * threes;
};

// Part 2 code.
const areSimilarEnough = (x, y) => {
  let differences = 0;

  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) differences++;
  }

  return differences === 1;
};

const diffIndex = (x, y) => {
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) return i;
  }
};

const p2 = () => {
  let result;
  utils.forEachPair(lines, ([x, y]) => {
    if (areSimilarEnough(x, y)) {
      console.log('Hooray');
      let dI = diffIndex(x, y);
      result = x.substring(0, dI) + x.substring(dI + 1);
      return false;
    }
  });
  return result;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
