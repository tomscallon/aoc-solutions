// Tom Scallon. Advent of Code 2019, day 3.

// Read in input.
const {input} = process.env;
const lines = input.split('\n');
const wires = lines.map(l => l.split(',').map(s => ({
  d: s[0],
  a: +s.substring(1),
})));

const getAllPositions = wire => {
  let pos = {x: 0, y: 0};
  const all = ['0,0'];

  wire.forEach(({d, a}) => {
    const diff = {
      x: d === 'R' ? 1 : d === 'L' ? -1 : 0,
      y: d === 'U' ? 1 : d === 'D' ? -1 : 0,
    };

    for (let i = 0; i < a; i++) {
      pos = {
        x: pos.x + diff.x,
        y: pos.y + diff.y,
      };
      all.push(`${pos.x},${pos.y}`);
    }
  });

  return new Set(all);
};

const intersect = (a, b) => a.filter(x => b.includes(x));

// Part 1 code.
const p1 = () => {
  const [all1, all2] = wires.map(getAllPositions);
  const intersections = intersect(all1, all2)
    .map(s => s.split(',').map(Number).reduce((x, y) => Math.abs(x) + Math.abs(y), 0))
    .filter(x => x !== 0);
  return Math.min(...intersections);
};

const getAllPositions2 = wire => {
  let pos = {x: 0, y: 0};
  const all = {};
  let dist = 0;

  wire.forEach(({d, a}) => {
    const diff = {
      x: d === 'R' ? 1 : d === 'L' ? -1 : 0,
      y: d === 'U' ? 1 : d === 'D' ? -1 : 0,
    };

    for (let i = 0; i < a; i++) {
      pos = {
        x: pos.x + diff.x,
        y: pos.y + diff.y,
      };
      const key = `${pos.x},${pos.y}`;
      ++dist;
      if (!(key in all)) {
        all[key] = dist;
      }
    }
  });

  return all;
};

// Part 2 code.
const p2 = () => {
  const [all1, all2] = wires.map(getAllPositions2);
  const [pos1, pos2] = [all1, all2].map(Object.keys);
  const intersections = intersect(pos1, pos2)
    .map(x => all1[x] + all2[x])
    .filter(x => x !== 0);

  return Math.min(...intersections);
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
