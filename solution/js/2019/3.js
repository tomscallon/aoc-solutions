// Tom Scallon. Advent of Code 2019, day 3.

// Read in input.
const {input} = process.env;
const lines = input.split('\n');
const wires = lines.map(l => l.split(',').map(s => ({
  d: s[0],
  a: +s.substring(1),
})));

const DIFFS = {
  R: {x:  1, y:  0},
  L: {x: -1, y:  0},
  U: {x:  0, y:  1},
  D: {x:  0, y: -1},
};

const iteratePositions = (wire, fn) => {
  let pos = {x: 0, y: 0};
  let dist = 0;

  wire.forEach(({d, a}) => {
    const diff = DIFFS[d];

    for (let i = 0; i < a; i++) {
      fn(pos = {
        x: pos.x + diff.x,
        y: pos.y + diff.y,
      }, ++dist);
    }
  });
};

// Part 1 code.
const p1 = () => {
  const all = {};

  iteratePositions(wires[0], ({x, y}) => all[`${x},${y}`] = true);
  delete all['0,0'];

  let closest = null;
  iteratePositions(wires[1], ({x, y}) => {
    const key = `${x},${y}`;
    if (key in all) {
      const dist = Math.abs(x) + Math.abs(y);
      if (closest == null || dist < closest) {
        closest = dist;
      }
    }
  });

  return closest;
};

// Part 2 code.
const p2 = () => {
  const all = {};

  iteratePositions(wires[0], ({x, y}, dist) => {
    const key = `${x},${y}`;
    if (!(key in all)) {
      all[key] = dist;
    }
  });
  delete all['0,0'];

  let closest = null;
  iteratePositions(wires[1], ({x, y}, dist) => {
    const key = `${x},${y}`;
    if (key in all) {
      const totalDist = all[key] + dist;
      if (closest == null || totalDist < closest) {
        closest = totalDist;
      }
    }
  });
  return closest;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
