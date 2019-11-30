// Tom Scallon. Advent of Code 2015, day 13.
const utils = require('../../utils.js');

// Read in input.
const RE = /^([A-Za-z]+) would (gain|lose) (\d+) happiness units by sitting next to ([A-Za-z]+).$/;

const toHappinessMap = (map, {person, nextTo, amount}) => {
  if (!map[person]) {
    map[person] = {[nextTo]: amount};
  } else {
    map[person][nextTo] = amount;
  }

  return map;
};

const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(line => {
    const [, person, direction, amount, nextTo] = RE.exec(line);

    return {
      person,
      nextTo,
      amount: direction === 'lose' ? -amount : +amount
    };
  })
  .reduce(toHappinessMap, {});

// Part 1 code.
const computeHappiness = arr => arr
  .reduce((total, p, i) => {
    const p2 = arr[(i + 1) % arr.length];

    return total + input[p][p2] + input[p2][p];
  }, 0);

const p1 = () => utils.permutations(Object.keys(input))
  .map(computeHappiness)
  .sort((a, b) => b - a)[0];

// Part 2 code.
const p2 = () => {
  // Add me to the map!
  input['me'] = {};
  Object.keys(input).forEach(person => {
    input[person]['me'] = 0;
    input['me'][person] = 0;
  });

  return utils.permutations(Object.keys(input))
    .map(computeHappiness)
    .sort((a, b) => b - a)[0];
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
