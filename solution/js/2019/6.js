// Tom Scallon. Advent of Code 2019, day 6.

// Read in input.
const {input} = process.env;
const orbits = input.split('\n').map(l => l.split(')'));

const orbitPred = {};

for (let [orbited, orbiter] of orbits) {
  orbitPred[orbiter] = orbited;

  if (!(orbited in orbitPred)) {
    orbitPred[orbited] = null;
  }
}

// Part 1 code.
const p1 = () => {
  let total = 0;
  for (let planet in orbitPred) {
    while (orbitPred[planet] != null) {
      total++;
      planet = orbitPred[planet];
    }
  }
  return total;
};

const getPathToRoot = start => {
  const ret = [start];
  let curr = orbitPred[start];

  while (curr != null) {
    ret.push(curr);
    curr = orbitPred[curr];
  }

  return ret;
};

// Part 2 code.
const p2 = () => {
  const santaPath = getPathToRoot(orbitPred.SAN);
  const youPath = getPathToRoot(orbitPred.YOU);

  let match;
  for (let p of youPath) {
    if (santaPath.includes(p)) {
      match = p;
      break;
    }
  }

  return santaPath.indexOf(match) + youPath.indexOf(match);
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
