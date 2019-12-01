// Tom Scallon. Advent of Code 2016, day 1.

// Read in input.
const {input} = process.env;
const lines = input.split('\\n');

const instructions = input.split(', ').map(i => ({
  rot: i[0],
  len: +i.substring(1),
}));

const nextDir = (cur, rot) => (cur + (rot === 'L' ? 1 : 3)) % 4;
const nextPos = ({x, y}, dir, len) => dir % 2 === 0
  ? {x: x + len * (dir === 0 ? 1 : -1), y}
  : {x, y: y + len * (dir === 1 ? 1 : -1)};

// Part 1 code.
const p1 = () => {
  const {p: {x, y}} = instructions.reduce(
    (c, i) => ({
      d: nextDir(c.d, i.rot),
      p: nextPos(c.p, nextDir(c.d, i.rot), i.len),
    }),
    {p: {x: 0, y: 0}, d: 0},
  );

  return Math.abs(x) + Math.abs(y);
};

// Part 2 code.
const p2 = () => {
  const toString = ({x, y}) => `${x},${y}`;

  let p = {x: 0, y: 0};
  let d = 0;
  const ps = [toString(p)];

  for (let i of instructions) {
    d = nextDir(d, i.rot);

    for (let j = 0; j < i.len; j++) {
      p = nextPos(p, d, 1);
      const pstr = toString(p);
      if (ps.includes(pstr)) {
        return Math.abs(p.x) + Math.abs(p.y);
      }
      ps.push(pstr);
    }
  }
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
