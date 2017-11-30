// Tom Scallon. Advent of Code 2015, day 9.
const utils = require('../../utils.js');

// Read in input.
const parseLine = line => {
  const [, p1, p2, d] = /([A-Za-z]+) to ([A-Za-z]+) = (\d+)/.exec(line);

  return {p1, p2, d: +d};
};

const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(parseLine);

// Part 1 code.
const toDistMap = (map, {p1, p2, d}) => {
  p1 in map ?
    map[p1][p2] = d :
    map[p1] = {[p2]: d};

  p2 in map ?
    map[p2][p1] = d :
    map[p2] = {[p1]: d};

  return map;
};

const totalDistance = (perm, distMap) => {
  let dist = 0;

  for (let i = 1; i < perm.length; i++) {
    dist += distMap[perm[i - 1]][perm[i]];
  }

  return dist;
}

const p1 = () => {
  const distMap = input.reduce(toDistMap, {});
  const places = Object.keys(distMap);

  return utils.permutations(places)
    .map(p => totalDistance(p, distMap))
    .sort((a, b) => a - b)[0];
};

// Part 2 code.
const p2 = () => {
  const distMap = input.reduce(toDistMap, {});
  const places = Object.keys(distMap);

  return utils.permutations(places)
    .map(p => totalDistance(p, distMap))
    .sort((a, b) => b - a)[0];
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
