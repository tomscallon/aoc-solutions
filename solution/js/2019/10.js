// Tom Scallon. Advent of Code 2019, day 10.
const F = require('./fn');

// Read in input.
const {input} = process.env;
const lines = input.split('\n');

const asteroids = {};
const keyFor = (r, c) => `${r},${c}`;
const parseKey = k => k.split(',').map(Number);

lines.forEach((line, r) => {
  for (let c = 0; c < line.length; c++) {
    if (line[c] === '#') {
      asteroids[keyFor(r, c)] = true;
    }
  }
});

const gcd = (a, b) =>
  a === 0 || b === 0
    ? Math.max(a, b)
    : a % b === 0
      ? b
      : gcd(b, a % b);

const positionsBetween = (a, b) => {
  const [[ra, ca], [rb, cb]] = [a, b].map(parseKey);
  let dr = rb - ra;
  let dc = cb - ca;

  const scale = gcd(Math.abs(dr), Math.abs(dc));
  dr /= scale;
  dc /= scale;

  let r = ra + dr;
  let c = ca + dc;
  const res = [];
  while (r !== rb || c !== cb) {
    res.push(keyFor(r, c));
    r += dr;
    c += dc;
  }
  return res;
}

const calcVisibility = as => {
  const visibility = F.objMap(as, () => []);

  for (const [a, b] of F.pairs(Object.keys(as))) {
    if (!positionsBetween(a, b).some(p => as[p])) {
      visibility[a].push(b);
      visibility[b].push(a);
    }
  }

  return visibility;
};

// Part 1 code.
const p1 = () => {
  const visibility = calcVisibility(asteroids);
  const bestPos = F.objKeyMaxBy(
    visibility,
    F.collectAnd(F.pick('1', 'length')),
  );
  return visibility[bestPos].length;
};

// Part 2 code.
const p2 = () => {
  const visibility = calcVisibility(asteroids);
  const bestPos = F.objKeyMaxBy(
    visibility,
    F.collectAnd(F.pick('1', 'length')),
  );

  const _200th = F.sortBy(
    visibility[bestPos].map(parseKey).map(k => k.reverse()),
    F.polarAngleFrom(
      parseKey(bestPos).reverse(),
      {anchor: 270},
    ),
  )[199];

  return _200th[0] * 100 + _200th[1];
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
